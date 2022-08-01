import firebase from "./firebase";

const firestore = firebase.firestore()

const createDocument = (collection, document) => {
    return firestore.collection(collection).add(document);
  };

  const readDocuments = async ({
    collection,
    orderByField,
    orderByDirection,
    perPage,
  }) => {
    let collectionRef = firestore.collection(collection);
  
    if (orderByField && orderByDirection) {
      collectionRef = collectionRef.orderBy(orderByField, orderByDirection);
    }
  
    if(perPage) {
      collectionRef = collectionRef.limit(perPage);
    }
    
    return collectionRef.get();
  };

  const FirebaseFirestoreService = {
    createDocument,
    readDocuments,
  };
  
  export default FirebaseFirestoreService;
  