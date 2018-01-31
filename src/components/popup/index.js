import React, { Component } from 'react';

import glamorous from 'glamorous';

const Wrapper = glamorous.div({
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    backgroundColor: '#fff',

    overflowY: 'auto',
})

const Content = glamorous.div({
    position: 'relative',
    margin: '0 auto',
    width: '10rem',
    minHeight: '100%',

    backgroundColor: '#f0f0f0',

    overflow: 'hidden',

    boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
})


const TWrapper = glamorous(Wrapper)({
    backgroundColor: 'transparent',
})

const TContent = glamorous(Content)({
    backgroundColor: 'transparent',
})

export default class Popup extends Component {
    
    static cnt = 0;

    componentDidMount() {
        Popup.cnt ++;
        if (Popup.cnt) {
            document.body.style.position = 'fixed';
        }
    }

    componentWillUnmount() {
        Popup.cnt --;
        if (Popup.cnt === 0) {
            document.body.style.position = '';
        }
    }

    render() {
        const {transparent = false, children, className, ...props} = this.props;

        if (transparent) {
            return (
                <TWrapper {...props}>
                    <TContent className={className}>{ children }</TContent>
                </TWrapper>
            )
        } else {
            return (
                <Wrapper {...props}>
                    <Content className={className}>{ children }</Content>
                </Wrapper>
            )
        }
    }
}