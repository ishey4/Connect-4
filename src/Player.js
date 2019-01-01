import React, { Component } from 'react';
import './connect-4.css';

export class PlayerObj {
    name = undefined;
    pcs = undefined;
    color = undefined;
    isWinner = false;
    constructor(props) {
        Object.assign(this, props)
    }
}


export class Player extends React.Component {
    updateProp(prop) {
        return (e) => {
            let nv = {}
            nv[prop] = e.target.value
            this.props.updateValues(nv);
        }
    }

    render() {
        return (
            <div className="PlayerContainer">
                <div className={'player ' + (this.props.isWinner ? 'winner' : '')}>
                    <label>Name: <input type="text" value={this.props.name} onChange={this.updateProp('name')} /></label>
                    <label>Color: <input type="text" value={this.props.color} onChange={this.updateProp('color')} /></label>
                    <input type="button" value="Remove" onClick={this.props.Remove} />
                </div>
            </div>
        )
    }

    constructor(props) {
        super(props)
    }
}