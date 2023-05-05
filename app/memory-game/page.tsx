"use client";

import { useEffect, useState, MouseEvent, useMemo } from "react";
import styles from "./page.module.scss";

enum CardState {
  Down,
  Selected,
  Up,
}

type Card = {
  value: string;
  state: CardState;
};

function shuffleCards(): Card[] {
  return Array.from("🤡🤡💩💩👽👽🧟🧟👻👻🦄🦄🧙🧙🤬🤬🦉🦉😈😈")
    .map((value) => ({ value, state: CardState.Down }))
    .sort(() => 0.5 - Math.random());
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);

  const selected = useMemo(
    () => cards.filter((card) => card.state === CardState.Selected),
    [cards]
  );

  useEffect(() => {
    setCards(shuffleCards());
  }, []);

  useEffect(() => {
    if (selected.length === 2) {
      const timeout = setTimeout(() => {
        const state =
          selected[0].value === selected[1].value
            ? CardState.Up
            : CardState.Down;
        selected.forEach((card) => (card.state = state));
        setCards([...cards]);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [cards]);

  function onNewClick() {
    setCards(shuffleCards());
  }

  function onCardClick(card: Card) {
    card.state = CardState.Selected;
    setCards([...cards]);
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Memory Game</h1>
      <button type="button" onClick={onNewClick} className={styles.new}>
        New
      </button>
      <div className={styles.board}>
        {cards.map((card, index) => (
          <MemoryGameCard
            key={index}
            card={card}
            onClick={() => onCardClick(card)}
            disabled={card.state !== CardState.Down || selected.length >= 2}
          />
        ))}
      </div>
    </div>
  );
}

function MemoryGameCard({
  card,
  onClick,
  disabled,
}: {
  card: Card;
  onClick: () => void;
  disabled: boolean;
}) {
  function onMouseMove(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (0.5 - (event.clientX - rect.left) / rect.width) * 0.75;
    const y = (0.5 - (event.clientY - rect.top) / rect.height) * 0.75;
    event.currentTarget.style.setProperty("--x", `${x}`);
    event.currentTarget.style.setProperty("--y", `${y}`);
  }

  return (
    <button
      onClick={onClick}
      onMouseMove={onMouseMove}
      disabled={disabled}
      className={`${styles.card} ${
        card.state === CardState.Down
          ? styles.down
          : card.state === CardState.Selected
          ? styles.selected
          : styles.up
      }`}
    >
      {card.state !== CardState.Down && card.value}
    </button>
  );
}
