import React, { Component } from 'react';
import './connect-4.css';
import { BlocksObj, BlockColumn, Block } from './Block'
import { Player, PlayerObj } from './Player'
import { GamePropertiesObj, GameProperties } from './GameProperties'


class connect4 extends Component {
  constructor(props) {
    super(props)
    this.state = {};
    Object.assign(this.state, this.options)
    this.state.counter = this.counter();
    this.state.GameProps = new GamePropertiesObj({
      updateCurrentTurn: this.updateCurrentTurn,
      k: this.state.counter(),
      nextPlayer: (this.nextPlayer),
      colorList: ['red', 'green', 'blue', 'yellow','purple'],
      MOVMENTDIRECTIONS: [{ h: 1, w: 0 }, { h: 0, w: 1 }, { h: 1, w: 1 }, { h: -1, w: 1 }],
      newGame: this.newGame.bind(this)
    });
    this.state.Players = []
    this.newGame();
  }

  newGame(options) {
    options = Object.assign({ GameBoard: { h: 6, w: 7 }, GameProps: { winner: undefined } }, options)
    this.state.GameBoard = new BlocksObj().CreateGameBoard(options.GameBoard.h, options.GameBoard.w);
    let gp = {
      placePiece: this.placePiece.bind(this),
      checkForWinner: this.checkForWinner.bind(this),
      winner: undefined
    }
    this.state.Players.forEach(player=>{player.isWinner=false;})
    Object.assign(this.state.GameProps, gp)
    this.setState(this.state)
  }

  updateCurrentTurn = (player) => {
    let newGameProps = this.state.GameProps;
    let pt = player.target.value
    newGameProps.currentTurn = this.state.Players.filter(p => { return p.k == pt })[0]
    this.setState({ GameProps: newGameProps })
  }

  counter() { let a = 0; return () => { a = a + 1; return a } }

  updateVals(oldVals) {
    let old = oldVals
    return (newVals) => {
      let ind = this.state.Players.indexOf(old)
      let np = Object.assign(this.state.Players[ind], newVals);
      this.state.Players.splice(ind, 1, np)
      this.setState({ Players: this.state.Players });
    }

  }

  placePiece(BlockRow, nextPlayer) {
    if (!this.state.GameProps.winner) {
      let cp = this.state.GameProps.currentTurn
      let PiecePlaced = false;
      let placedPiece;
      for (let h = 0; h < BlockRow.length; h++) {
        if (BlockRow[h].player && !PiecePlaced) {
          placedPiece = BlockRow[h - 1]
          placedPiece.player = cp;
          PiecePlaced = true;
        }
      }
      if (!PiecePlaced) {
        placedPiece = BlockRow[BlockRow.length - 1]
        placedPiece.player = cp
      };

      this.state.GameProps.checkForWinner({ h: placedPiece.h, w: placedPiece.w }, cp)
      this.setState({ GameBoard: this.state.GameBoard })
    }
  }

  nextPlayer() {
    let ind = this.state.Players.indexOf(this.state.GameProps.currentTurn) + 1;
    let turn;
    if (ind >= this.state.Players.length) { turn = this.state.Players[0]; }
    else { turn = this.state.Players[ind]; }
    let gp = this.state.GameProps;
    gp.currentTurn = turn;
    this.setState({ GameProps: gp });
    return gp;
  }

  addPlayer() {
    let newKey = this.state.counter()
    let pl = new PlayerObj({ name: 'Player' + (newKey-1).toString(), color: this.state.GameProps.colorList.pop() });
    pl.k = newKey;
    pl.updateValues = this.updateVals.bind(this)(pl);
    pl.Remove = () => { this.removePlayer(pl) };
    let newArray = this.state.Players.concat(pl);
    this.setState({
      Players: newArray,
      GameProps:
        Object.assign(this.state.GameProps, { nextPlayer: () => this.nextPlayer(),currentTurn:pl })
    });
  }

  removePlayer(player) {
    let ind = this.state.Players.indexOf(player)
    this.state.Players.splice(ind, 1)
    this.setState({ Players: this.state.Players })
  }

  getContinuousBlockCount(StartBlock, player, direction, count) {
    if (this.state.GameBoard[StartBlock.w] && this.state.GameBoard[StartBlock.w][StartBlock.h] && this.state.GameBoard[StartBlock.w][StartBlock.h].player === player) {
      return this.getContinuousBlockCount({ h: StartBlock.h + direction.h, w: StartBlock.w + direction.w }, player, direction, (count + 1))
    }
    return count
  }

  addDir(place, dir) {
    return { h: place.h + dir.h, w: place.w + dir.w }
  }

  checkForWinner(blockLocation, player, direction, count) {
    if (!this.state.GameProps.winner) {
      if (!direction) {
        this.state.GameProps.MOVMENTDIRECTIONS.forEach(dr => {
          let a = this.getContinuousBlockCount(this.addDir(blockLocation, dr), player, dr, 1)
          let invDr = { h: dr.h * -1, w: dr.w * -1 }
          let b = this.getContinuousBlockCount(this.addDir(blockLocation, invDr), player, invDr, 1)
          if ((a + b) >= 5) {
            player.isWinner=true;
            this.setState({Players:this.state.Players})
            this.setState(Object.assign(this.state.GameProps, { winner: player }));
          }
        });
      }
    }
  };

  render() {
    window['state'] = this.state
    let clk = (ary) => {
      this.state.GameProps.placePiece(ary, this.state.GameProps.nextPlayer)
      this.state.GameProps.nextPlayer()
    }
    return (
      <div className="connect-4">
      <h1>!Connect 4!</h1>
      <div className="left side">
      <GameProperties {...this.state} key={this.state.GameProps.k} />
      <div id="GameBoard">
          {this.state.GameBoard.map((h) => {
            return <BlockColumn ary={h} oc={clk} />
          })}
        </div>
      </div>

      <div className="right side">
      <div className="bold largeFont">Settings</div>
      <div className="addPlayer"><span onClick={this.addPlayer.bind(this)}>(Add Player)</span></div>
      {this.state.Players.map(p => {return <Player {...p} key={p.k} />})}
      </div>




      </div>
    );
  }
}

export default connect4;
