import React, { Component } from 'react';
import './connect-4.css';

export class GamePropertiesObj {
    currentTurn = 0;
    winner = undefined;
    updateCurrentTurn;
    constructor(props) {
        Object.assign(this, props)
    }
}


export class GameProperties extends React.Component {

    NG = () => {
        let H = this.state.H
        let W = this.state.W
        console.log(this)
        let options = {};
        if (H > 0 && W > 0) {
            options = { GameBoard: { h: H, w: W } }
        }
        console.log(options)
        this.props.GameProps.newGame(options)
    }

    setVal(props) {
        let $this = this
        return function (val) {
            let a = $this.state
            a[props] = val.target.value;
            $this.setState(a);
        }
    }
    render() {

        return (
            <div>
                <div className="CurrentTurn">
                    Current Turn:
                    <select value={this.props.GameProps.currentTurn.k} onChange={this.props.GameProps.updateCurrentTurn}>
                        {this.props.Players.map((p) => { return <option key={p.k} value={p.k}>{p.name}</option> })}
                    </select>
                </div>
                <div className={'Winner ' + (this.props.GameProps.winner===undefined ? 'hidden' :'') }>Winner:{(this.props.GameProps.winner && this.props.GameProps.winner.name)}</div>
                <div className="NewGame">
                    <label>Board:
                        <input id="BoardH" type="number" onClick={this.setVal("H")} />
                        x
                        <input id="BoardW" type="number" onClick={this.setVal("W")} />
                        <input type="button" value="New Game" onClick={this.NG}>
                        </input>
                    </label>
                </div>
            </div>
        )
    };
    constructor(props) {
        super(props)
        this.state = {}

    }
}