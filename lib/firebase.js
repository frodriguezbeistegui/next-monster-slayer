import firebase from "firebase/compat/app";
import 'firebase/compat/firestore'

const config = {

    apiKey: "AIzaSyCujPR7hBvs42_fI8gAhadYgKrTOpaTj5o",
  
    authDomain: "monster-slayer-e345b.firebaseapp.com",
  
    projectId: "monster-slayer-e345b",
  
    storageBucket: "monster-slayer-e345b.appspot.com",
  
    messagingSenderId: "1058248812368",
  
    appId: "1:1058248812368:web:fef1a8eec7b79073fc6e55"
  
  };
  
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  
  export default firebase;
  