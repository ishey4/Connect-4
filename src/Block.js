
import React, { Component } from 'react';
import './connect-4.css';

export class BlocksObj {
    filled = false;
    player = undefined;

    constructor(props) {
        Object.assign(this, props)
    }

    CreateGameBoard(height, width) {
        let blockArray = [];
        blockArray[0] = [];
        blockArray[0][0] = this;

        for (let w = 0; w < width; w++) {
            for (let h = 0; h < height; h++) {
                if (!blockArray[w]) { blockArray[w] = [] }
                if (!blockArray[w][h]) { blockArray[w][h] = new BlocksObj({ h: h, w: w }) }
            }
        }
        return blockArray;
    }
}

export class Block extends React.Component {

    render() {
        let bc = (this.props.player && this.props.player.color) || 'rgba(255,255,255,0)'
        return (
            <div className="Block" style={{ backgroundColor: bc }}>
                <div>
                </div>
            </div>
        )
    }
    constructor(props) {
        super(props)
    }
}

export class BlockColumn extends React.Component {
    clk = () => { this.props.oc(this.props.ary) }
    render() {
        let ary = this.props.ary;
        return (
            <div className="Column" onClick={this.clk}>
                {this.props.ary.map((e) => {
                    return (<Block {...e} />)
                })}
            </div>
        )
    }

    constructor(props) {
        super(props)
    }
}