"use client";

import { useState } from "react";
import styles from "./page.module.scss";

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isX, setIsX] = useState(true);

  function onClickCell(index: number) {
    const current = isX ? "X" : "O";
    const newBoard = [...board];
    newBoard[index] = current;
    setBoard(newBoard);
    setIsX(!isX);
  }

  return (
    <div className={styles.page}>
      <h1>Tic Tac Toe</h1>
      <button
        type="button"
        onClick={() => {
          setBoard(Array(9).fill(""));
          setIsX(true);
        }}
      >
        New
      </button>
      <div className={styles.grid}>
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onClickCell(index)}
            className={styles.cell}
            disabled={cell}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
