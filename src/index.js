import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Display the location for each move in the format (col, row) in the move history list.
// ---- Bold the currently selected item in the move list.
// ---- Rewrite Board to use two loops to make the squares instead of hardcoding them.
// Add a toggle button that lets you sort the moves in either ascending or descending order.
// When someone wins, highlight the three squares that caused the win.
// ---- When no one wins, display a message about the result being a draw.


function Square(props) {
  return (
    <button
      className='square'
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    let squareValue = this.props.squares[i];
    return <Square
      value={squareValue}
      onClick={() => this.props.onClick(i)}
      key={i}
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
      stepNumber: 0
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const currentBoard = history[history.length-1];
    const squares = currentBoard.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({ 
      history: history.concat([{ // concat instead of push b/c it creates a new array (copy instead of change)
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {

    const history = this.state.history;
    const currentBoard = history[this.state.stepNumber];
    const currentStep = this.state.stepNumber;

    const winner = calculateWinner(currentBoard.squares);
    const moves = history.map((step, move) => {
      const desc = move 
        ? 'Go to move #' + move
        : 'Go to game start';

        console.log('current step/step: ' + currentStep + '/' + move);
        
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
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

  // go thru each possible win & see if all are same value
  for(let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}