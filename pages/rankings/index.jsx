import Link from 'next/link';
import FirebaseFirestoreService from '../../lib/FirebaseFirestoreService';

export const getStaticProps = async () => {
  let results = [];
  try {
    const querySnapshot = await FirebaseFirestoreService.readDocuments({
      collection: 'results',
      orderByField: 'rounds',
      orderByDirection: 'asc',
      perPage: '10',
    });
    querySnapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        username: doc.data().username,
        rounds: doc.data().rounds,
        date: doc.data().date,
      });
    });
  } catch (error) {
    console.log('Error getting documents: ', error);
  }

  return {
    props: {
      results,
    },
    revalidate: 10,
  };
};

export default function ranking({ results = []}) {
  return (
    <div className="rankings-container">
      <h1 className='rankings-title'>Top 10 ranking</h1>
      {results.map((res, i) => (
        <div className='ranking-container' key={res.date}>
            <h2 className='ranking__content-number'>#{i + 1}</h2> 
            <p className='ranking__content'><span className='ranking__content-user' >{res.username}</span> has won the game within <span className='ranking__content-rounds'>{res.rounds}</span> rounds!</p>
            <Link href={`/rankings/${res.id}`}>
              <a className='ranking__content-link'>Watch full result</a>
            </Link>
        </div>
      ))}
        <Link href={'/'}>
        <a className='button-play-again'>Play again</a>
      </Link>
    </div>
  );
}
