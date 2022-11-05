import { initializeApp } from 'firebase/app';
import { getFirestore, doc, addDoc, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_firebaseConfig_apiKey,
  authDomain: 'cat-vs-dog-738e6.firebaseapp.com',
  projectId: 'cat-vs-dog-738e6',
  storageBucket: 'cat-vs-dog-738e6.appspot.com',
  messagingSenderId: process.env.REACT_APP_firebaseConfig_messagingSenderId,
  appId: process.env.REACT_APP_firebaseConfig_appId,
  measurementId: process.env.REACT_APP_firebaseConfig_measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firestore = {
  async setDocRoom() {
    await addDoc(collection(db, 'games'), {
      roomState: 'wait',
    });
  },
};

export default firestore;
