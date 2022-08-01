import FirebaseFirestoreService from '../../lib/FirebaseFirestoreService';

export const getStaticProps = async ({ params }) => {
  const { id } = params;
  const res = await FirebaseFirestoreService.readDocument('results', id);
  const { username, rounds, date } = res.data();
  const data = { username, rounds, date };
  console.log(data, 'this is a data console.log()');
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
    <div>
      {data.username} has won in {data.rounds} at {dateString}
    </div>
  );
}
