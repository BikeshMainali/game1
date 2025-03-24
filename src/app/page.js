'use client';

import { useState, useEffect } from 'react';

// Square Component
function Square({ value, onSquareClick, isWinning }) {
  function handleClickWithSound() {
    const audio = new Audio('/firstsound.mp3');
    audio.play();
    onSquareClick();
  }

  return (
    <button
      className={`square ${isWinning ? 'winning' : ''}`}
      onClick={handleClickWithSound}
    >
      {value}
    </button>
  );
}

// Board Component
function Board({ xIsNext, squares, onPlay, onRestart }) {
  const winner = calculateWinner(squares);
  const winningSquares = winner ? winner.line : [];

  // Play sound when winner is detected
  useEffect(() => {
    if (winner) {
      const audio = new Audio('/winning.mp3');
      audio.play();
    }
  }, [winner]);

  function handleClick(i) {
    if (winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const status = winner
    ? `Winner: ${winner.player}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <>
      <div className={`status ${winner ? 'winner' : ''}`}>{status}</div>
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onSquareClick={() => handleClick(idx)}
                isWinning={winningSquares.includes(idx)}
              />
            );
          })}
        </div>
      ))}
      <button className="restart-btn" onClick={onRestart}>
        Restart Game 🔄
      </button>
    </>
  );
}

// Calculate Winner Utility
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
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line };
    }
  }
  return null;
}

// Game Component
function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handlePlay(nextSquares) {
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="game">
      <Board
        xIsNext={xIsNext}
        squares={squares}
        onPlay={handlePlay}
        onRestart={handleRestart}
      />
    </div>
  );
}

// Page Component for Next.js
export default function Page() {
  return <Game />;
}
