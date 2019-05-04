import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Square = (props)=>{
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

const Move = (props)=>{
  let desc = props.move !== 0 ? 'Go to move #' + props.move : 'Go to game start';
  return (
    <li>
      <button onClick={()=>props.onClick(props.move)}>{desc}</button>
    </li>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
      />
      );
  }
  
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
  
class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        xIsNext: true,
        winner: null
      }],
      step: 0
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const current = history[this.state.step];

    if (current.winner !== null) {
      return;
    }

    const squares = current.squares.slice();

    if (squares[i] !== null) {
      return;
    }

    let nextStep = this.state.step + 1;
    squares[i] = current.xIsNext ? 'X' : 'O';
    let preHistory = history.slice(0, nextStep);
    let nextHistory = preHistory.concat({
      squares: squares,
      xIsNext: nextStep%2 === 0,
      winner: this.calculateWinner(squares,preHistory.length)
    });

    this.setState({
      history: nextHistory,
      step: nextStep
    });
  }

  calculateWinner(squares, total) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    if (total >= 9)
      return 'D';
    else 
      return null;
  }

  jumpTo(i) {
    this.setState({
      step: i
    })
  }

  render() {
    let status;
    const history = this.state.history;
    const current = history[this.state.step];
    let winner = current.winner;
    
    if (winner !== null) {
      if (winner !== 'D')
        status = 'Winner: ' + winner;
      else
        status = 'Draw';
    } else {
      status = 'Next player: ' + (current.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((h,index)=>{
      return <Move move={index} key={index} onClick={(i)=>this.jumpTo(i)} />
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i)=>this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  