import BottleFlip from './game';
import React from 'react';
import ReactDOM from 'react-dom';
import { rem } from './utils';
import glamorous, {Div} from 'glamorous';

import _auth from './auth';

import store from './store';
import { Provider, connect } from 'react-redux';

import { request } from './utils';

import { Toast } from 'antd-mobile';

import Share from './components/share/index';
import Guide from './components/guide/index';

const game = new BottleFlip();
game.start();

const Button = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  backgroundColor: '#fdfdfd',
  color: '#000',
  fontWeight: 'bold',
  fontSize: rem(54),
  lineHeight: 'normal',
  height: rem(156),
  width: rem(512),
  borderRadius: rem(156 / 2),
  margin: '0 auto',
  boxShadow: `0 ${rem(4)} ${rem(12)} ${rem(4)} rgba(113, 113, 113, 0.4)`
});

const Wrapper = glamorous.div({
  width: '10rem',
  margin: '0 auto',
  position: 'relative',
  minHeight: '100%',
})

const Avatar = glamorous.img({
  width: rem(110),
  height: rem(110),
  verticalAlign: 'top',
  borderRadius: rem(5),
})

const Panel = glamorous.div({
  margin: '0 auto',
  width: rem(926),
});

const Header = glamorous.div({
  position: 'relative',

  boxSizing: 'border-box',
  display: 'flex',

  alignItems: 'center',
  lineHeight: 'normal',

  height: rem(102),
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderRadius: `${rem(10)} ${rem(10)} 0 0`,
});

const Body = glamorous.div({
  border: '1px solid rgba(255, 255, 255, 0.4)',
  borderTop: 'none',
});

const Circle = glamorous.div({
  position: "absolute",
  right: rem(-50),
  top: rem(-50),
  width: rem(100),
  height: rem(100),
  borderRadius: rem(50),
  backgroundColor: "#ffffff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#00c777",
  fontSize: rem(40),
  fontWeight: "bold",
  cursor: "pointer",
});

const ShareButton = glamorous(Share)({
  cursor: 'pointer',

  margin: '0 auto',
  width: rem(225),
  height: rem(85),
  borderRadius: rem(85 / 2),
  border: '1px solid #fff',
  color: '#f7f7f7',
  fontSize: rem(36),

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const RuleButton = glamorous.div({
  cursor: 'pointer',

  background: `url(${require('./assets/btn_game_rule.png')}) no-repeat`,
  backgroundSize: 'cover',

  width: rem(86 / 75 * 108),
  height: rem(86 / 75 * 108),

  position: 'absolute',
  left: rem(30 / 75 * 108),
  top: rem(30 / 75 * 108),
})

const Close = props => {
  return <Circle {...props}>&times;</Circle>
}

class Logout extends React.Component {
  handleClick = e => {
    _auth.logout();
  }

  render() {
    const ChangeAccount = glamorous.div({
      cursor: 'pointer',

      background: `url(${require('./assets/btn_change_account.png')}) no-repeat`,
      backgroundSize: 'cover',
      
      width: rem(86 / 75 * 108),
      height: rem(86 / 75 * 108),

      position: 'absolute',
      right: rem(30 / 75 * 108),
      top: rem(30 / 75 * 108),
    });
    
    return <ChangeAccount onClick={this.handleClick}/>
  }
}

@connect(
  null,
  dispatch => ({
    handleCloseClick: () => {
      dispatch({type: 'SET_LOCATION', payload: 'Landing'});
    }
  })
)
class Rule extends React.Component {
  render() {
    const { handleCloseClick } = this.props;
    return <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', color: '#ffffff' }}>
      <Wrapper>
      <Div display="flex" justifyContent="center" alignItems="center" position="absolute" left="0" right="0" top="0" bottom="0" height="100%">
      <Panel>
        <Header fontSize={rem(30)}>
          <Div color="rgba(255, 255, 255, 0.35)" flex="1" fontSize={rem(30)} paddingLeft={rem(40)}>比赛规则 - 赛事奖励</Div>
          <Close onClick={handleCloseClick}/>
        </Header>
        <Body>
          <Div maxHeight={rem(1000)} overflowY="auto">
          <Div fontSize={rem(32)} color="#aaa" padding={rem(30)}>
            <p>赛事奖励（最终排行榜）：</p>
            <p>第一名: 奖励总价值400元优惠券</p>
            <p>第二名到第十名: 每人奖励总价值200元优惠券</p>
            <p>第十一名到第一百名: 每人奖励总价值50元优惠券</p>
            <p>第一百名到第三百名: 每人奖励总价值20元游戏优惠券</p>
            <p>第三百名到第五百名: 每人奖励总价值5元游戏优惠券</p>
            <p>按成绩排行，成绩相同的先提交成绩的排在前面</p>
            <p>-</p>
            <p>比赛时间：</p>
            <p>2018年2月19日 - 2018年2月23日</p>
            <p>-</p>
            <p>比赛说明：</p>
            <p>1、每天免费获取8次参赛机会；额外机会可通过10积分购买（每日限制购买10次）；</p>
            <p>2、如发现任何违规、套取奖励行为将视情节严重程度进行判罚：不予发放奖励、冻结通过推荐有奖所获得的奖励、依法追究其法律责任；</p>
            <p>3、活动奖励将在2月23日中午12点统一进行发放；发放奖励以优惠券组合礼包发放到排行榜相应安锋账号中，可以在游戏充值进行使用；</p>
          </Div>
          </Div>
        </Body>
      </Panel>
      </Div>
      </Wrapper>
    </div>;
  }
}

@connect(
  ({auth}) => ({auth}),
)
class Landing extends React.Component {
  handleStartClick = e => {
    const {auth} = this.props;
    if (!auth.logging && !auth.user) {
      _auth.login();
    } else if(auth.user){
      if (auth.remain) {
        this.props.dispatch({type: 'GAME_START', payload: null});
      } else {
        this.props.dispatch({type: 'GAME_START_POINTS'});
      }
    }
  }

  handleRuleClick = e => {
    this.props.dispatch({type: 'SET_LOCATION', payload: 'Rule'})
  }

  handleRankingClick = e => {
    this.props.dispatch({type: 'SHOW_RANKING', payload: null});
  }

  render() {
    const {auth} = this.props;
    return <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.3)', color: '#ffffff' }}>
      <Wrapper>
      <Div fontSize={rem(148)} fontWeight="bold" textAlign="center" paddingTop={rem(340)} >跳 一 跳</Div>
      <Div position="absolute" bottom={rem(259)} width="100%">
        <Div marginTop={rem(128)}>
          <Button onClick={this.handleStartClick}>开始游戏</Button>
        </Div>
        <Div marginTop={rem(128)}>
          <Button onClick={this.handleRankingClick}>查看排行</Button>
        </Div>
      </Div>
      <Div fontSize={rem(36)} textAlign="center" position="absolute" width="100%" bottom={rem(70)} >剩余次数: {auth.remain}</Div>
      <Logout/>
      <RuleButton onClick={this.handleRuleClick}/>
      <Guide/>
      </Wrapper>
  </div>;
  }
}

@connect(
  ({ranking}) => ({ranking}),
  dispatch => ({
    handleRankingLinkClick: () => {
      dispatch({type: 'SHOW_RANKING', payload: null})
    },
    handleRestartClick: () => {
      dispatch({type: 'SET_LOCATION', payload: 'Landing'})
    }
  })
)
class Score extends React.Component {
  render() {
    const { handleRankingLinkClick, handleRestartClick, ranking } = this.props;
    return <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', color: '#ffffff' }}>
      <Wrapper>
      <Div textAlign="center" fontSize={rem(34)} paddingTop={rem(200)}>本次得分</Div>
      <Div textAlign="center" fontSize={rem(146)} fontWeight="bold" marginTop={rem(20)} marginBottom={rem(40)}>{ ranking.score }</Div>
      <Div marginBottom={rem(100)}>
        <ShareButton
          image={`${window.location.origin}/bottle-flip/300x300.png`}
          title={`邀请你参与『安锋杯』 跳一跳排位赛`}
          content={`『玩游戏 赢大奖』 我得了${ranking.score}分，排${ranking.rank}名，等你挑战我！`}
          url={window.location.href}>
            挑战好友
        </ShareButton>
      </Div>
      <Panel>
        <Header fontSize={rem(30)}>
          <Div color="#818181" flex="1" fontSize={rem(30)} paddingLeft={rem(40)}>排行榜 - 每周一凌晨更新</Div>
          <Div color="rgba(255, 255, 255, 0.8)" flex="none" fontSize={rem(30)} paddingRight={rem(24)} cursor="pointer" onClick={handleRankingLinkClick}>查看全部排行 &gt;</Div>
        </Header>
        <Body>
          <Div display="flex">
            {
              ranking.relative.map(item => {
                return <Div key={item.id} textAlign="center" flex="1">
                  <Div color="rgba(255, 255, 255, 0.35)" fontSize={rem(36)} fontWeight="bold" fontStyle="italic" marginTop={rem(30)} marginBottom={rem(20)} >{item.rank}</Div>
                  <Avatar src={item.avatar} alt=""/>
                  <Div color="#818181" fontSize={rem(32)} marginTop={rem(36)}>{item.username}</Div>
                  <Div color="#ffffff" fontSize={rem(42)} fontWeight="bold" marginTop={rem(30)} marginBottom={rem(50)}>{item.score}</Div>
                </Div>
              }) 
            }
          </Div>
        </Body>
      </Panel>
      <Div position="absolute" height={rem(415)} bottom="0" width="100%">
        <Button onClick={handleRestartClick}>再玩一局</Button>
        <Div fontSize={rem(36)} textAlign="center" position="absolute" width="100%" bottom={rem(70)} >历史最高分: {ranking.highest.score}</Div>
      </Div>
      <Guide/>
      </Wrapper>
    </div>
  }
}


@connect(
  ({ranking}) => ({ranking}),
  dispatch => ({
    handleCloseClick: () => {
      dispatch({type: 'GO_BACK', payload: null});
    }
  })
)
class Ranking extends React.Component {
  render() {
    const { handleCloseClick, ranking } = this.props;
    return <div style={{ position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.8)', color: '#ffffff' }}>
      <Wrapper>
      <Div display="flex" justifyContent="center" alignItems="center" position="absolute" left="0" right="0" top="0" bottom="0" height="100%">
      <Panel>
        <Header fontSize={rem(30)}>
          <Div color="rgba(255, 255, 255, 0.35)" flex="1" fontSize={rem(30)} paddingLeft={rem(40)}>排行榜 - 每周一凌晨更新</Div>
          <Div position="absolute"
              right={rem(-50)} top={rem(-50)} width={rem(100)} height={rem(100)}
              borderRadius={rem(50)}
              backgroundColor="#ffffff"
              display="flex"
              justifyContent="center"
              alignItems="center"
              color="#00c777"
              fontSize={rem(40)}
              fontWeight="bold"
              cursor="pointer"
              onClick={handleCloseClick}
              >&times;</Div>
        </Header>
        <Body>
          <Div maxHeight={rem(1000)} overflowY="auto" >
            {
              ranking.all.map(item => (
                <Div key={item.id} display="flex" flex="1" padding={rem(40)}>
                  <Div color="#aaaaaa" fontSize={rem(36)} fontWeight="bold" fontStyle="italic" width={rem(100)} display="flex" justifyContent="center" alignItems="center" marginRight={rem(40)} >{item.rank}</Div>
                  <img  style={{ verticalAlign: 'top', width: rem(90), height: rem(90), borderRadius: rem(5) }} src={item.avatar} alt=""/>
                  <Div color="#ffffff" fontSize={rem(38)} lineHeight="normal" flex="1"  display="flex" alignItems="center" marginLeft={rem(50)}>{item.username}</Div>
                  <Div color="#ffffff" fontSize={rem(42)} fontWeight="bold" display="flex" alignItems="center">{item.score}</Div>
                </Div>
              ))
            }
          </Div>
        </Body>
      </Panel>
      </Div>
      </Wrapper>
    </div>
  }
}

@connect(
  ({round}) => ({round}),
)
class Game extends React.Component {
  componentDidMount() {
    game.restart(parseInt(this.props.round.id, 10));
  }

  componentWillUnmount() {
    
  }

  render() {
    return null;
  }
}

@connect(
  ({flexible, round}) => ({flexible, round})
)
class KeepAlive extends React.Component {
  container = null;

  onRef = ref => {
    this.container = ref;
  }

  handleGameOver = async () => {
    const {round} = this.props;
    this.props.dispatch({
      type: 'GAME_END',
      payload: {
        id: round.id,
        score: game.score,
        extra: JSON.stringify({steps: game.steps})
      }
    });
  }

  componentDidMount() {
    this.container.appendChild(game.renderer.domElement);
    game.addEventListener('gameover', this.handleGameOver);
  }

  componentWillUnmount() {
    this.container.removeChild(game.renderer.domElement);
    game.removeEventListener('gameover', this.handleGameOver);
  }

  render() {
    return <Wrapper>
      <div ref={this.onRef}></div>
    </Wrapper>
  }
}

@connect(
  ({location}) => ({location})
)
class Index extends React.Component {
  render() {
    const pages = {
      Score,
      Ranking,
      Landing,
      Rule,
      Game,
    };
    return this.props.location ? React.createElement(pages[this.props.location.current]) : null;
  }
}


class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
          <React.Fragment>
            <KeepAlive/>
            <Index/>
          </React.Fragment>
      </Provider>
    );
  }
}


ReactDOM.render(<App/>, document.getElementById('root'));
