import React, { Component } from 'react';


export default class Back extends Component {

    handleClick() {
        window.history.back();
    }

    render() {
        return <div {...this.props} onClick={this.handleClick}/>;
    }
}

