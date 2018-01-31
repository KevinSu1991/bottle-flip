import React from 'react';

import glamorous from 'glamorous';

const Left = glamorous.div({
    position: 'fixed',
    left: 0,
    height: '100%',
    width: 'calc(50% - 5rem)',
    backgroundColor: '#333',
});

const Right = glamorous.div({
    position: 'fixed',
    right: 0,
    height: '100%',
    width: 'calc(50% - 5rem)',
    backgroundColor: '#333',
})

const Wrapper = glamorous.div({
    margin: '0 auto',
    width: '10rem',
});

export default ({children, ...props}) => {
    return <Wrapper {...props}>
        <Left/>
        <Right/>
        { children }
    </Wrapper>;
}