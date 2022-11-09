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
  async updateHostHitPoints(roomID: string | undefined, hitPoints: number) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      'host.hitPoints': increment(hitPoints),
    });
  },
  async updateGuestHitPoints(roomID: string | undefined, hitPoints: number) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      'guest.hitPoints': increment(hitPoints),
    });
  },
  async updateHostHavePowerUp(roomID: string | undefined, roundCount: number) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      'host.havePowerUp': false,
    });
    await updateDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      'host.radius': 40,
    });
  },
  async updateGuestHavePowerUp(roomID: string | undefined, roundCount: number) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      'guest.havePowerUp': false,
    });
    await updateDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      'guest.radius': 40,
    });
  },
  async updateHostHaveHeal(roomID: string | undefined) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      'host.haveHeal': false,
    });
  },
  async updateGuestHaveHeal(roomID: string | undefined) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      'guest.haveHeal': false,
    });
  },
  async updateHostHaveDoubleHit(roomID: string | undefined, roundCount: number) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      'host.haveDoubleHit': false,
    });
    await updateDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      'host.hitPointsAvailable': 30,
    });
  },
  async updateGuestHaveDoubleHit(roomID: string | undefined, roundCount: number) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      'guest.haveDoubleHit': false,
    });
    await updateDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      'guest.hitPointsAvailable': 30,
    });
  },
  async updateHostQuantityOfPower(roomID: string | undefined, roundCount: number, power: number) {
    await updateDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      'host.quantityOfPower': power,
    });
  },
  async updateGuestQuantityOfPower(roomID: string | undefined, roundCount: number, power: number) {
    await updateDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      'guest.quantityOfPower': power,
    });
  },
  async updateHostGetPoints(roomID: string | undefined, roundCount: number, points: number) {
    await updateDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      'host.getPoints': points,
    });
  },
  async updateGuestGetPoints(roomID: string | undefined, roundCount: number, points: number) {
    await updateDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      'guest.getPoints': points,
    });
  },
  async setNewRound(roomID: string | undefined, roundCount: number, windSpeed: number) {
    await setDoc(doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount}`), {
      windSpeed: `${windSpeed}`,
      host: {
        radius: 20,
        hitPointsAvailable: 15,
      },
      guest: {
        radius: 20,
        hitPointsAvailable: 15,
      },
    });
  },
};

export default firestore;
