import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Display the location for each move in the format (col, row) in the move history list.
// ---- Bold the currently selected item in the move list.
// ---- Rewrite Board to use two loops to make the squares instead of hardcoding them.
// 50%- Add a toggle button that lets you sort the moves in either ascending or descending order.
// ---- When someone wins, highlight the three squares that caused the win.
// ---- When no one wins, display a message about the result being a draw.


function Square(props) {
  return (
    <button
      className={'square ' + (props.highlight ? 'highlight' : '')}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    let squareValue = this.props.squares[i];
    let isPartOfWinningMove = this.props.winningMove && this.props.winningMove.some(s => s === i);
    return <Square
      value={squareValue}
      onClick={() => this.props.onClick(i)}
      key={i}
      highlight={isPartOfWinningMove}
    />;
  }

  renderRow(i) {
    return (
      <div className="board-row" key={i}>
        {[0, 1, 2].map(columnIndex => (
          this.renderSquare(i+columnIndex)
        ))}
      </div>
    )
  }

  render() {

    return (
      <div>
        {[0,1,2].map(rowIndex => (
          this.renderRow(rowIndex*3)
        ))}
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [
        { squares: Array(9).fill(null) }
      ],
      xIsNext: true,
      stepNumber: 0,
      sortMovesDescending: false,
      winningMove: null
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const currentBoard = history[history.length-1];
    const squares = currentBoard.squares.slice();

    var winnerFound = calculateWinner(squares);
    if (winnerFound || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ 
      history: history.concat([{ // concat instead of push b/c it creates a new array (copy instead of change)
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      winningMove: calculateWinningMove(squares)
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winningMove: null
    });
  }

  toggleSort() {
    this.setState({
      sortMovesDescending: !this.state.sortMovesDescending
    });
  }

  render() {

    const history = this.state.history;
    const currentBoard = history[this.state.stepNumber];
    const currentStep = this.state.stepNumber;

    const winner = calculateWinner(currentBoard.squares);
    const moveList = this.state.sortMovesDescending 
      ? history.slice().reverse()
      : history;

    const moves = moveList.map((step, move) => {
      const desc = move 
        ? 'Go to move #' + move
        : 'Go to game start';

        return (
          <li key={move} className={currentStep === move ? 'highlight' : ''}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {

      const allSquaresFilled = currentBoard.squares.every(s => {
        return s; 
      });

      status = allSquaresFilled 
        ? 'Draw'
        : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={currentBoard.squares}
            onClick={(i) => this.handleClick(i)}
            stepNumber={this.state.stepNumber}
            winningMove={this.state.winningMove}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.toggleSort()}>
            Toggle Sort
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinningMove(squares) {
    // go thru each possible win & see if all are same value
    for(let i = 0; i < winningLines.length; i++) {
      const [a,b,c] = winningLines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }

    return null;
}

function calculateWinner(squares) {

  // go thru each possible win & see if all are same value
  for(let i = 0; i < winningLines.length; i++) {
    const [a,b,c] = winningLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}