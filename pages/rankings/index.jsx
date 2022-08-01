import Link from 'next/link';
import FirebaseFirestoreService from '../../lib/FirebaseFirestoreService';

export const getStaticProps = async () => {
  let results = [];
  try {
    const querySnapshot = await FirebaseFirestoreService.readDocuments({
      collection: 'results',
      orderByField: 'rounds',
      orderByDirection: 'asc',
      perPage: '5',
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
  results.map((res) => {
  });
  return (
    <div className="results-container">
      <h1>Top 10 ranking</h1>
      {results.map((res, i) => (
        <div key={res.date}>
            <h2>#{i + 1}</h2> 
            <p><span className='results-user'>{res.username}</span> has won the game within {res.rounds} rounds!</p>
            <Link href={`/rankings/${res.id}`} >Watch full result</Link>
        </div>
      ))}
    </div>
  );
}
