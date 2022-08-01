import Link from 'next/link';
import Router from 'next/router';
import { useRef, useState } from 'react';
import FirebaseFirestoreService from '../lib/FirebaseFirestoreService';

export default function GameLayout() {
  const [userHealth, setUserHealth] = useState(100);
  const [monsterHealth, setMosterHealth] = useState(100);
  const [rounds, setRounds] = useState(0);
  const [roundsToSpecial, setRoundsToSpecial] = useState(0);
  const [result, setResult] = useState(null);


  // Set the controllers to mannage the game behavior
  const handleAction = (action) => {
    // every click adds a round and triggers a moster attack
    setRounds(rounds + 1);
    setRoundsToSpecial(roundsToSpecial + 1);
    monsterAtack();
    // determinate and run the action that the user want to do 
    switch (action) {
      case 'heal':
        heal(7, 15);
        break;
      case 'atack':
        userAtack(20, 25);
        break;
      case 'special':
        userAtack(9, 15);
        setRoundsToSpecial(0);
        break;
    }
  };

  const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  const userAtack = (min, max) => {
    const value = randomBetween(min, max);
    if (monsterHealth - value <= 0) win();
    setMosterHealth(monsterHealth - value);
  };

  const heal = (min, max) => {
    const value = randomBetween(min, max);
    if (userHealth + value >= 100) setUserHealth(100);
    else setUserHealth(userHealth + value);
  };

  const monsterAtack = () => {
    const value = randomBetween(9, 12);
    if (userHealth - value <= 0) lose();
    else setUserHealth(userHealth - value);
  };

  const lose = () => {
    setResult('lose');
  };

  const win = () => {
    setResult('win');
  };

  const playAgain = () => {
    setUserHealth(100);
    setMosterHealth(100);
    setRounds(0);
    setRoundsToSpecial(0);
    setResult(null);
  };

  const specialActive = roundsToSpecial >= 3 ? 'active' : false;
  return result ? (
    <FinalScreen rounds={rounds} result={result} playAgain={playAgain} />
  ) : (
    <div className="game__container">
      <div className="game__healthbar-container">
        <div className="game__healthbar game__healthhbar-user">
          <div
            style={{ width: `${userHealth}%` }}
            className="game__healthbar-current--health"
          ></div>
          <strong className="game__healthbar-value">User: {userHealth}%</strong>
        </div>

        <div className="game__healthbar game__healthbar-moster">
          <div
            style={{ width: `${monsterHealth}%` }}
            className="game__healthbar-current--health"
          ></div>
          <strong className="game__healthbar-value">Monster: {monsterHealth}%</strong>
        </div>
      </div>

      <div className="game__controllers">
        <button
          className="btn btn-atack"
          onClick={() => {
            handleAction('atack');
          }}
        >
          Atack
        </button>
        <button
          disabled={!specialActive}
          className={'btn btn-special ' + specialActive}
          onClick={() => {
            handleAction('special');
          }}
        >
          Special Atack
        </button>
        <button
          className="btn btn-heal"
          onClick={() => {
            handleAction('heal');
          }}
        >
          Heal
        </button>
        <button onClick={lose} className="btn btn-surrender">Surrender</button>
      </div>
    </div>
  );
}

function FinalScreen({ result, playAgain, rounds }) {
  const [popup, setPopup] = useState(false);

  const username = useRef(null);

  const publishResult = async (rounds, username) => {
    const newResult = {
      date: Date.now(),
      rounds,
      username,
    };
    try {
      await FirebaseFirestoreService.createDocument('results', newResult);
      alert('Result uploaded successfully');
      Router.push('/results');
    } catch (error) {
      alert('There was a problem uploading your result, try again later');
      throw error;
    }
  };

  const handleClick = () => {
    if (popup === true) {
      if (username.current.value.length > 3) return publishResult(rounds, username.current.value);
      else return alert('username must be at least 3 character long');
    }
    if (!popup) return setPopup(!popup);
  };

  return (
    <div className={result}>
      <h1>You {result}!</h1>
      {result === 'win' ? (
        <div>
          <p>You have won in {rounds} rounds!</p>
          <button onClick={() => handleClick()}>Publish your Result</button>
        </div>
      ) : null}
      {popup ? (
        <div className="popup">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Your username"
            ref={username}
            onChange={() => console.log(username.current.value)}
          />
        </div>
      ) : null}

      <button
        onClick={() => {
          playAgain();
        }}
      >
        Play again!
      </button>
      <Link href={'/results'}>Watch top results</Link>
    </div>
  );
}
