import { useState, useRef } from "react";
import Link from "next/link";
import FirebaseFirestoreService from "../lib/FirebaseFirestoreService";

export const getServerSideProps = async (ctx) => {
    const rounds = ctx.query.rounds
    const result = ctx.params.result

    return {
        props: {
            result,
            rounds
        }
    }
}

export default function result({ result, rounds }) {
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
        Router.push('/ranking');
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
  
        <Link href={'/'}>Play again!</Link>
        <Link href={'/rankings'}>Watch top ranking</Link>
      </div>
    );
  }