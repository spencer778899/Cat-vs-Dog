import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, updateDoc, increment } from 'firebase/firestore';

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
  async updateRoomState(roomID: string | undefined, state: string) {
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
  async decreaseGuestHitPoints(roomID: string | undefined, hitPoints: number) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      'guest.hitPoints': increment(-1 * hitPoints),
    });
  },
  async setNewRound(roomID: string | undefined, roundCount: number, windSpeed: number) {
    await setDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      windSpeed: `${windSpeed}`,
    });
  },
  async updateHostQuantityOfPower(roomID: string | undefined, roundCount: number, power: number) {
    await updateDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      host: { quantityOfPower: power },
    });
  },
};

export default firestore;
