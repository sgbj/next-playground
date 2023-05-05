"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";

const MAX_POKEMON = 151;
const MAX_ANSWERS = 4;

export default function WhosThatPokemon() {
  const [allPokemon, setAllPokemon] = useState<any>();
  const [pokemonDetails, setPokemonDetails] = useState<any>();
  const [answers, setAnswers] = useState<any[]>([]);
  const [answer, setAnswer] = useState<any>();

  useEffect(() => {
    const abortController = new AbortController();

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`, {
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((json) => {
        setAllPokemon(json);
        nextPokemon(json);
      });

    return () => abortController.abort();
  }, []);

  async function nextPokemon(allPokemon: any) {
    const results = [...allPokemon.results];
    results.sort(() => 0.5 - Math.random());
    const start = Math.floor(Math.random() * (results.length - MAX_ANSWERS));
    const slice = results.slice(start, start + MAX_ANSWERS);
    const pokemon = slice[Math.floor(Math.random() * MAX_ANSWERS)];
    setAnswers(slice);
    setAnswer(null);
    setPokemonDetails(null);
    fetch(pokemon.url)
      .then((res) => res.json())
      .then(setPokemonDetails);
  }

  return (
    <div className={`${styles.page} ${answer && styles.answered}`}>
      <h1>Who's that Pokemon?</h1>
      <button
        type="button"
        onClick={() => {
          setAnswer(null);
          nextPokemon(allPokemon);
        }}
        className={styles.new}
      >
        New
      </button>
      {pokemonDetails && (
        <>
          <img
            src={pokemonDetails.sprites.front_default}
            alt="Pokemon silhouette"
          />
          <div className={styles.answers}>
            {answers.map((a) => (
              <button
                key={a.name}
                onClick={() => {
                  setAnswer(a);
                  setTimeout(() => nextPokemon(allPokemon), 1000);
                }}
                disabled={answer?.name}
                className={`${styles.answer} ${
                  a?.name === pokemonDetails?.name || answer?.name === a.name
                    ? a?.name == pokemonDetails?.name
                      ? styles.correct
                      : styles.incorrect
                    : ""
                }`}
              >
                <span>{a.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
