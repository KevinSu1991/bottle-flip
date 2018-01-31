import React from 'react';
import glamorous from 'glamorous';

import Spinner from 'react-spinkit';

const Wrapper = glamorous.div({
    position: 'relative',
    overflow: 'hidden',
});

const Content = glamorous.div({
    opacity: 0.7,
    filter: 'blur(.5px)',
});

const Front = glamorous.div({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const Spin = ({spinning = false, children, ...props}) => {

    return spinning ? (<Wrapper>
        <Content>{children}</Content>
        <Front><Spinner name="folding-cube" color="rgba(255, 204, 0, 0.8)" { ...props}/></Front>
    </Wrapper>) : children
}

export default Spin;