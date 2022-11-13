import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  updateDoc,
  increment,
  deleteDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';

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
export const auth = getAuth(app);
export const storage = getStorage(app);

export const firestorage = {
  async uploadPhotoURL(photo: File, id: string) {
    try {
      const photoRef = ref(storage, `photos/${id}`);
      await uploadBytes(photoRef, photo);
      const photoURL = await getDownloadURL(photoRef);
      return photoURL;
    } catch (e) {
      console.log(e);
      alert('上傳失敗~');
    }
  },
};

export const authentication = {
  async register(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (e) {
      console.log(e);
      alert('註冊失敗!');
    }
  },
  async signIn(mail: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, mail, password);
      alert('登入成功!');
    } catch (e) {
      console.log(e);
    }
  },
  async signOut() {
    try {
      await signOut(auth);
      alert('帳號已經登出~');
    } catch (e) {
      console.log(e);
    }
  },
};

const firestore = {
  // friendRequest collection
  async setNewInvitation(email: string, uid: string, nickname: string, photoURL: string) {
    await setDoc(doc(db, 'friendRequest', `${email}`, 'invitation', `${uid}`), {
      uid: `${uid}`,
      nickname: `${nickname}`,
      photoURL: `${photoURL}`,
    });
  },
  async deleteInvitation(email: string, uid: string) {
    await deleteDoc(doc(db, 'friendRequest', `${email}`, 'invitation', `${uid}`));
  },
  // user collection
  async addUser(id: string | undefined, name: string, mail: string) {
    try {
      await setDoc(doc(db, 'users', `${id}`), {
        uid: id,
        nickname: name,
        email: mail,
        photoURL:
          'https://firebasestorage.googleapis.com/v0/b/cat-vs-dog-738e6.appspot.com/o/photos%2F9v2is0Mb9HS0r8kRiVRqPZKwawI2?alt=media&token=0f033cb8-b8d5-4c9e-94e5-3a57bf7fc72a',
        friends: [],
        inviting: '',
      });
      alert('註冊成功!');
    } catch (e) {
      console.log(e);
      alert('註冊失敗!');
    }
  },
  async getUser(id: string) {
    try {
      const user = await getDoc(doc(db, 'users', `${id}`));
      return user.data();
    } catch (e) {
      console.log(e);
    }
  },
  async updatePhotoURL(id: string, URL: string) {
    try {
      await updateDoc(doc(db, 'users', `${id}`), {
        photoURL: URL,
      });
      alert('頭貼上傳成功!');
    } catch (e) {
      console.log(e);
    }
  },
  async updateFriends(id: string, newList: [string]) {
    await updateDoc(doc(db, 'users', `${id}`), {
      friends: newList,
    });
  },
  async updateInviting(id: string, roomID: string) {
    await updateDoc(doc(db, 'users', `${id}`), {
      inviting: roomID,
    });
  },
  // game collection
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
