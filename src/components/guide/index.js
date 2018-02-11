import React from 'react';
import glamorous from 'glamorous';
import { rem } from '../../utils';


const Image = glamorous.div({
    background: `url(${require('./ic_xfq.png')}) no-repeat`,
    backgroundPosition: 'bottom',
    backgroundSize: 'cover',
    width: rem(196),
    height: rem(196)
});

const Link = glamorous.a({
    position: 'absolute',
    right: rem(8),
    bottom: rem(58),
});

export default class Guide extends React.Component {
    render() {
        return <Link href="/guide/"><Image/></Link>;
    }
}