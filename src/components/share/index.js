import React, { Component, Fragment } from 'react';
import { Toast } from 'antd-mobile'
import glamorous from 'glamorous';
import ReactDOM from 'react-dom';

import Rx from 'rxjs/Rx';

import { rem, env, request } from '../../utils';

import Popup from '../popup/index';

const  { wx } = window;

const Overlay = glamorous.div({
    zIndex: 1000,
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
})

class ShareHidden extends Component {
    render() {
        return null;
    }
}

class ShareWeixin extends Component {
    static jssdk = new Promise(async resolve => {
        const params = await request('/index.php?d=api&c=wechat&m=jssdk', {url: window.location.href });
        wx.config({
            debug: false,
            appId: params.appId, // 必填，公众号的唯一标识
            timestamp: params.timestamp, // 必填，生成签名的时间戳
            nonceStr: params.nonceStr, // 必填，生成签名的随机串
            signature: params.signature, // 必填，签名，见附录1
            jsApiList: [
                'checkJsApi', //判断当前客户端版本是否支持指定JS接口
                'onMenuShareTimeline', //分享给好友
                'onMenuShareAppMessage', //分享到朋友圈
                'onMenuShareQQ' //分享到QQ
            ]
        });
        wx.ready(resolve);
    })

    state = {
        visible: false,
    }

    container = document.createElement('div');
    
    
    componentWillMount() {
        const {wx} = window;
        const {title, content, image, url, onSuccess = () => {}} = this.props;
        ShareWeixin.jssdk.then(() => {
            wx.onMenuShareTimeline({ //分享到朋友圈
                title: title,
                desc: content, // 分享描述
                link: url,
                imgUrl: image,
                success: onSuccess
            });

            wx.onMenuShareAppMessage({ //分享到朋友
                title: title, // 分享标题
                desc: content, // 分享描述
                link: url, // 分享链接
                imgUrl: image, // 分享图标
                success: onSuccess
            });
        }).subscribe();
        document.body.appendChild(this.container);
    }

    componentWillUnmount() {
        document.body.removeChild(this.container);
    }
    
    handleOpen = e => {
        this.setState({visible: true});
    }

    handleClose = e => {
        e.stopPropagation();
        this.setState({visible: false});
    }

    render() {

        const Tips = glamorous.div({
            position: 'absolute',
            top: 0,
            right: rem(100),

            width: rem(511),
            height: rem(496),
            background: `url(${require('./share.png')}) no-repeat`,
            backgroundSize: 'cover',
        })

        const Top = glamorous.div({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: rem(30),
            background: '#393a3f',
        })

        const children = (
            <Popup transparent><Overlay onClick={this.handleClose}>
                <Top/>
                <Tips/>
            </Overlay></Popup>
        )

        return (
            <div {...this.props} onClick={this.handleOpen}>
                <Fragment>
                    {
                        this.props.children
                    }
                    {
                        this.state.visible ? ReactDOM.createPortal(children, this.container) : null
                    }
                </Fragment>
            </div>
        )
    }
}

class ShareBrowser extends Component {

    handleClick = e => {
        Toast.info('请使用浏览器自带分享功能');
    }

    render() {
        return <div {...this.props} onClick={this.handleClick}></div>
    }
}

class ShareAnfengGame extends Component {
    handleClick = e => {
        const {title, content, image, url} = this.props;
        const data = {
            title,
            content,
            img: image,
            url,
            ext: { hack: 'NOT_EMPTY' }
        }
        window.anfeng.share(JSON.stringify(data))
    }

    render() {
        return <div {...this.props} onClick={this.handleClick}></div>
    }
}

export default class Share extends Component {

    getComponent() {
        switch (true) {
            case (env('ANFENG_SDK_ANDROID') || env('ANFENG_SDK_IOS')): return ShareHidden;
            case env('ANFENG_GAME'): return ShareAnfengGame;
            case env('WEIXIN'): return ShareWeixin;
            default: return ShareBrowser;
        }
    }

    render() {
        const Component = this.getComponent();
        return <Component {...this.props}/>
    }
}