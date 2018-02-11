import Flexible from './flexible';
import _auth from './auth';
import Rx from 'rxjs/Rx';


import { request } from './utils';

import { createStore, combineReducers, applyMiddleware , compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import { Toast, Modal } from 'antd-mobile';



const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;
  
    //onRejected 
const gameStartEpic = action$ => action$
  .ofType('GAME_START')
  .throttle(() => Rx.Observable.merge(
    action$.ofType('GAME_START_FINISH'),
  ))
  .mergeMap(action => {
    const request$ = Rx.Observable
      .fromPromise(request('/index.php?c=GameAction&m=startGame'))
      .map(data => ({type: 'GAME_START_FULFILLED', payload: data}))
      .catch(err => Rx.Observable.of({type: 'GAME_START_REJECTED', payload: err}))
    return request$;
  });

const gameEndEpic = action$ => action$.ofType('GAME_END')
  .mergeMap(({payload}) => Rx.Observable
    .fromPromise(request('/index.php?c=GameAction&m=reportScore', payload))
    .map(data => ({type: 'GAME_END_FULFILLED', payload: data}))
    .catch(err => Rx.Observable.of({type: 'GAME_END_REJECTED', payload: err}))
  )

const authEpic = action$ => action$
  .ofType('AUTH_INIT')
  .mergeMap(() => (_auth.token()))
  .mergeMap(token => {
    return Rx.Observable.fromPromise(request('/index.php?c=GameAction&m=status', {token}))
    .map(data => ({type: 'AUTH_INIT_FULFILLED', payload: data}))
    .catch(err => Rx.Observable.of({type: 'AUTH_INIT_REJECTED', payload: err}))
  })


const showRankingEpic = action$ => action$.ofType('SHOW_RANKING')
  .throttle(() => action$.ofType('SHOW_RANKING_FINISH'))
  .mergeMap(() => 
    Rx.Observable.fromPromise(request('/index.php?c=GameAction&m=ranking'))
      .map(data => ({type: 'SHOW_RANKING_FULFILLED', payload: data}))
      .catch(err => Rx.Observable.of({type: 'SHOW_RANKING_REJECTED', payload: err}))
  )


const rootEpic = combineEpics(
  gameStartEpic,
  gameEndEpic,
  authEpic,
  showRankingEpic,

  action$ => action$.ofType('GAME_START_POINTS')
  .mergeMap(() => {
    return Rx.Observable.fromPromise(new Promise(resolve => {
      Modal.alert('开始挑战', '花费20积分兑换一次挑战机会', [
        {text: '取消', onPress: () => resolve(false)},
        {text: '兑换', onPress: () => resolve(true)},
      ]);
    })).filter(value => value).mapTo({type: 'GAME_START'});
  }),
  action$ => Rx.Observable.merge(
    action$.ofType('SHOW_RANKING_FULFILLED'),
    action$.ofType('SHOW_RANKING_REJECTED'))
  .mapTo({type: 'SHOW_RANKING_FINISH'}),

  action$ => Rx.Observable.merge(
    action$.ofType('GAME_START_FULFILLED'),
    action$.ofType('GAME_START_REJECTED'))
  .mapTo({type: 'GAME_START_FINISH'}),

  action$ => Rx.Observable.merge(
    action$.ofType('AUTH_INIT_FULFILLED'),
    action$.ofType('AUTH_INIT_REJECTED'))
  .mapTo({type: 'AUTH_INIT_FINISH'}),

  action$ => Rx.Observable.merge(
    action$.ofType('GAME_END_FULFILLED'),
    action$.ofType('GAME_END_REJECTED'))
  .mapTo({type: 'GAME_END_FINISH'}),

  action$ => action$.ofType('GAME_END_FULFILLED')
    .map(({payload}) => ({type: 'SET_RANKING', payload})),

  action$ => action$
    .ofType('GAME_END_FULFILLED')
    .mapTo({type: 'SET_LOCATION', payload:'Score'}),
  
  action$ => action$
    .ofType('GAME_END_REJECTED')
    .mapTo({type: 'SET_LOCATION', payload:'Landing'}),

  action$ => Rx.Observable.merge(
      action$.ofType('GAME_START_FINISH'),
      action$.ofType('AUTH_INIT_FINISH'),
      action$.ofType('GAME_END_FINISH'),
      action$.ofType('SHOW_RANKING_FINISH'),
    ).mapTo({type: 'LOADING_END'}),

  action$ => Rx.Observable.merge(
    action$.ofType('GAME_START'),
    action$.ofType('AUTH_INIT'),
    action$.ofType('GAME_END'),
    action$.ofType('SHOW_RANKING'),
  ).mapTo({type: 'LOADING_START'}),

  action$ => action$
    .ofType('GAME_START_FULFILLED')
    .mapTo({type: 'SET_LOCATION', payload:'Game'}),
  
  action$ => Rx.Observable.merge(
    action$.ofType('GAME_START_REJECTED'),
    action$.ofType('GAME_END_REJECTED'),
    action$.ofType('SHOW_RANKING_REJECTED'),
  )
    .map(({payload}) => ({type: 'MESSAGE', payload: payload.toString()}))
    .do(({payload: message}) => {
      Toast.info(message);
    }),

  action$ => Rx.Observable.merge(
      action$.ofType('LOADING_START').mapTo(1),
      action$.ofType('LOADING_END').mapTo(-1),
    )
    .scan((acc, value) => (acc + value), 0)
    .map(cnt => ({type: 'LOADING_VISIBLE', payload: cnt > 0}))
    .do(({payload: visible}) => {
      if (visible) {
        Toast.loading('加载数据..', 0);
      } else {
        Toast.hide();
      }
    }),

  action$ => action$.ofType('SHOW_RANKING_FULFILLED')
    .mapTo({type: 'SET_LOCATION', payload: 'Ranking'})
);

const epicMiddleware = createEpicMiddleware(rootEpic);


const _flexible = new Flexible(() => { 
  store.dispatch({type: 'SET_FLEXIBLE', payload: _flexible.state});
})


const HOF = (name, _state) => {
  return (state = _state, {type, payload}) => {
    switch (type) {
      case 'SET_' + name:
        return payload;
      default:
        return state; 
    }
  }
}

const round = (state = {}, {type, payload}) => {
  switch (type) {
    case 'GAME_START_FULFILLED':
      return payload;
    default:
      return state;
  }
}

const reducers = combineReducers({
  flexible: HOF('FLEXIBLE', _flexible.state),
  location: (state = {current: 'Rule', histories: ['Rule'], index: 0}, {type, payload}) => {
    switch (type) {
      case 'SET_LOCATION':
        let histories = [...state.histories];
        histories.length = state.index + 1;
        return {current: payload, histories: [...histories, payload], index: state.index + 1};
      case 'GO_BACK':
        return state.index > 0 ? {...state, current: state.histories[state.index - 1], index: state.index - 1} : state;
      default:
        return state;
    }
  },
  ranking: (state = {relative: [], highest: {score: 0}}, {type, payload}) => {
    switch (type) {
      case 'SET_RANKING':
        return {...state, ...payload};
      case 'SHOW_RANKING_FULFILLED':
        return {...state, all: payload};
      default:
        return state;
    }
  },
  auth: (state = {user: null, logging: false, plays: [], remain: 0}, {type, payload}) => {
    switch (type) {
      case 'AUTH_INIT':
        return {...state, logging: true};
      case 'AUTH_INIT_FULFILLED':
        return {...state, ...payload, logging: false, remain: Math.max(8 - payload.plays.length, 0)};
      case 'AUTH_INIT_REJECTED':
        return {...state, logging: false};
      case 'GAME_START_FULFILLED':
        return {...state, remain: Math.max(0, state.remain - 1)}
      default:
        return state;
    }
  },
  round,
  loading: (state = {cnt: 0, visible: false}, {type, payload}) => {
    let {cnt, visible} = state;
    switch (type) {
      case 'LOADING_START':
        ++ cnt;
        visible = cnt > 0;
        return {cnt, visible};
      case 'LOADING_END':
        -- cnt;
        visible = cnt > 0;
        return {cnt, visible};
      case 'LOADING_VISIBLE':
        return {...state, visible: payload};
      default:
        return state;
    }
  }
})

const store = createStore(reducers, composeEnhancers(applyMiddleware(epicMiddleware)));

store.dispatch({type: 'AUTH_INIT'});

export default store;