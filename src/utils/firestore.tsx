import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_firebaseConfig_apiKey,
  authDomain: 'cat-vs-dog-738e6.firebaseapp.com',
  projectId: 'cat-vs-dog-738e6',
  storageBucket: 'cat-vs-dog-738e6.appspot.com',
  messagingSenderId: process.env.REACT_APP_firebaseConfig_messagingSenderId,
  appId: process.env.REACT_APP_firebaseConfig_appId,
  measurementId: process.env.REACT_APP_firebaseConfig_measurementId,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const firestore = {
  async setDocRoomID() {
    const roomID = doc(collection(db, 'games'));
    await setDoc(roomID, {
      roomState: 'wait',
    });
    return roomID.id;
  },
  async updateRoomState(roomID: string, state: string) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      roomState: `${state}`,
    });
  },
  async updateDocHost(hostUid: string, roomID: string) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      host: {
        uid: hostUid, // dame
        hitPoints: 100,
        havePowerUp: true,
        haveHeal: true,
        haveDoubleHit: true,
      },
    });
  },
  async updateDocGuest(guestUid: string, roomID: string) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      guest: {
        uid: guestUid, // dame
        hitPoints: 100,
        havePowerUp: true,
        haveHeal: true,
        haveDoubleHit: true,
      },
    });
  },
};

export default firestore;
