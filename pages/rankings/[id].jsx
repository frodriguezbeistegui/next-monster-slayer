import Link from 'next/link';
import FirebaseFirestoreService from '../../lib/FirebaseFirestoreService';

export const getStaticProps = async ({ params }) => {
  const { id } = params;
  const res = await FirebaseFirestoreService.readDocument('results', id);
  const { username, rounds, date } = res.data();
  const data = { username, rounds, date };
  return {
    props: {
      data,
    }
  };
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths = async () => {
  let paths = [];
  try {
    const querySnapshot = await FirebaseFirestoreService.readDocuments({
      collection: 'results',
    });
    querySnapshot.forEach((doc) => {
      paths.push({
        params: { id: doc.id },
      });
    });
  } catch (error) {
    console.log('Error getting documents: ', error);
  }

  return {
    paths,
    fallback: 'blocking',
  };
};

export default function SingleResult({ data }) {
  const date = new Date(data.date);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const dateString = `${month}-${day}-${year}`;
  return (

    <div className='single--ranking-container'> 
      <p className='single--ranking-content'> <span className='single--ranking-user'>{data.username}</span> has won in <span className="single--ranking-rounds">{data.rounds}</span> at <span className='single--ranking-date' >{dateString}</span></p>
      <Link href={'/'}>
        <a className='button-play-again'>Play again</a>
      </Link>
    </div>
  );
}
