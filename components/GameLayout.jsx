import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function GameLayout() {
  const [userHealth, setUserHealth] = useState(100);
  const [monsterHealth, setMosterHealth] = useState(100);
  const [rounds, setRounds] = useState(0);
  const [roundsToSpecial, setRoundsToSpecial] = useState(0);

  const router = useRouter();

  // Monster will atack every update if rounds is not 0
  useEffect(() => {
    if (rounds !== 0) monsterAtack(8, 13);
  }, [rounds]);

  const displayResult = (result) => {
    const route = {
      pathname: `/${result}`,
      query: {
        rounds,
      },
    };
    setTimeout(() =>{
      router.push(route);
    }, 300)
  };

  // Set the controllers to mannage the game behavior
  const handleAction = async (action) => {
    // every click adds a round and triggers a moster attack
    setRounds(rounds + 1);
    setRoundsToSpecial(roundsToSpecial + 1);
    console.log(userHealth);
    // determinate and run the action that the user want to do
    switch (action) {
      case 'heal':
        heal(11, 16);
        break;
      case 'atack':
        userAtack(7, 11);
        break;
      case 'special':
        userAtack(10, 15);
        setRoundsToSpecial(0);
        break;
    }
  };

  const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

  const monsterAtack = (min, max) => {
    const value = randomBetween(min, max);
    if (userHealth - value <= 0) {
      setUserHealth(0);
      displayResult('lose');
    } else setUserHealth(userHealth - value);
  };

  const userAtack = (min, max) => {
    const value = randomBetween(min, max);
    if (monsterHealth - value <= 0) {
      setMosterHealth(0);
      displayResult('win');
    } else setMosterHealth(monsterHealth - value);
  };

  const heal = (min, max) => {
    const value = randomBetween(min, max);
    if (userHealth + value >= 100) setUserHealth(100);
    else setUserHealth(userHealth + value);
  };

  const specialActive = roundsToSpecial >= 3 ? 'active' : false;
  return (
    <div className="game__container">
      <h1 className='game-title'>Moster slayer</h1>

      <div className="game__healthbar-container">
        <div className="game__healthbar-wrap">
          <label className="game__healthbar-label">User health</label>
          <div className="game__healthbar game__healthhbar-user">
            <div
              style={{ width: `${userHealth}%` }}
              className="game__healthbar-current--health"
            ></div>
            <strong className="game__healthbar-value">{userHealth}%</strong>
          </div>
        </div>

        <div className="game__healthbar-wrap">
          <label className="game__healthbar-label">Monster health</label>
          <div className="game__healthbar game__healthbar-moster">
            <div
              style={{ width: `${monsterHealth}%` }}
              className="game__healthbar-current--health"
            ></div>
            <strong className="game__healthbar-value">Monster: {monsterHealth}%</strong>
          </div>
        </div>
      </div>
      <div className="game__rounds">
        <h1 className="game__rounds-label">Current round</h1>
        <strong className="game__rounds-number">{rounds}</strong>
      </div>

      <div className="game__controllers">
        <button
          className="btn"
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
        <button
          onClick={() => {
            displayResult('lose');
          }}
          className="btn btn-surrender"
        >
          Surrender
        </button>
      </div>
    </div>
  );
}
