import { useState, useRef } from 'react';
import Link from 'next/link';
import FirebaseFirestoreService from '../lib/FirebaseFirestoreService';
import { useRouter } from 'next/router';

export const getServerSideProps = async (ctx) => {
  const rounds = ctx.query.rounds;
  const result = ctx.params.result;

  return {
    props: {
      result,
      rounds,
    },
  };
};

export default function result({ result, rounds }) {
  const [popup, setPopup] = useState(false);

  const router = useRouter();

  const username = useRef(null);

  const publishResult = async (rounds, username) => {
    const newResult = {
      date: Date.now(),
      rounds: Number(rounds),
      username,
    };
    try {
      await FirebaseFirestoreService.createDocument('results', newResult);
      alert('Result uploaded successfully');
      router.push('/rankings');
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
    <div className={`result result-${result} `}>
      <h1 className="result__title">
        You <span className={`result__title result__title-span-${result}`}>{result}</span>!
      </h1>
      {result === 'win' ? (
        <div className="result__win-container">
          <p className="result__win-text">
            You have won in <span className="result__win-rounds">{rounds}</span> rounds!
          </p>
          <button onClick={() => handleClick()} className="result__win-cta">
            Publish your result
          </button>
        </div>
      ) : null}
      {popup ? (
        <div className="popup">
          <label htmlFor="username" className="popup__label">
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Your username"
            ref={username}
            onChange={() => console.log(username.current.value)}
            className="popup__input"
          />
        </div>
      ) : null}
      <div className="result__links">
        <Link href={'/'}>
          <a className="result__link">Play again!</a>
        </Link>
        <Link href={'/rankings'}>
          <a className="result__link">Watch top rankings</a>
        </Link>
      </div>
    </div>
  );
}
