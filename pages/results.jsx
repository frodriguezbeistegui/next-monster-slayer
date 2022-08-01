import FirebaseFirestoreService from '../lib/FirebaseFirestoreService';

export const getStaticProps = async () => {
  let results = [];
  try {
    const querySnapshot = await FirebaseFirestoreService.readDocuments({
      collection: 'results',
      orderByField: 'rounds',
      orderByDirection: 'desc',
      perPage: '5',
    });
    querySnapshot.forEach((doc) => {
      results.push({
        username: doc.data().username,
        rounds: doc.data().rounds,
        date: doc.data().date,
      });
    });
  } catch (error) {
    console.log('Error getting documents: ', error);
  }

  console.log('regenerated');
  return {
    props: {
      results,
    },
    revalidate: 10,
  };
};

// export const getStaticPaths = async (ctx) => {
//   return {
//     paths: [
//       {
//         params: [{ params: results }],
//       },
//     ],
//     fallback: true,
//   };
// };

export default function results({ results = []}) {
  results.map((res) => {
    console.log(res.username);
  });
  return (
    <div className="results-container">
      <h1>Top 10 ranking</h1>
      {results.map((res, i) => (
        <div key={res.date}>
            <h2>#{i + 1}</h2> 
            <p><span className='results-user'>{res.username}</span> has won the game within {res.rounds} rounds!</p>
        </div>
      ))}
    </div>
  );
}
