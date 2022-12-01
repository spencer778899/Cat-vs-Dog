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
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { toast } from 'react-toastify';

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
    const photoRef = ref(storage, `photos/${id}`);
    await uploadBytes(photoRef, photo);
    const photoURL = await getDownloadURL(photoRef);
    return photoURL;
  },
};

export const authentication = {
  async register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  },
  async signIn(mail: string, password: string) {
    await signInWithEmailAndPassword(auth, mail, password);
  },
  async signOut() {
    await signOut(auth);
  },
};

const firestore = {
  // accomplishments collection
  async setNewAccomplishment(id: string) {
    await setDoc(doc(db, 'accomplishments', `${id}`, 'goals', 'goal1'), {
      goalName: '結交兩個好友',
      achieved: false,
      progressRate: 0,
    });
    await setDoc(doc(db, 'accomplishments', `${id}`, 'goals', 'goal2'), {
      goalName: '在「對戰AI中」擊敗Level3',
      achieved: false,
      progressRate: 0,
    });
  },
  async getAccomplishments(id: string) {
    const goalsList: { goalName: string; achieved: boolean; progressRate: number }[] = [];
    const docs = await getDocs(collection(db, 'accomplishments', `${id}`, 'goals'));
    docs.forEach((Doc) => {
      const data = Doc.data() as { goalName: string; achieved: boolean; progressRate: number };
      goalsList.push(data);
    });
    return goalsList;
  },
  async updateGoal1ProgressRate(id: string, rate: number) {
    await updateDoc(doc(db, 'accomplishments', `${id}`, 'goals', 'goal1'), {
      progressRate: rate,
    });
  },
  async achieveGoal1(id: string) {
    await updateDoc(doc(db, 'accomplishments', `${id}`, 'goals', 'goal1'), {
      goalName: '解鎖「更換頭貼」',
      achieved: true,
      progressRate: 2,
    });
  },
  async achieveGoal2(id: string) {
    await updateDoc(doc(db, 'accomplishments', `${id}`, 'goals', 'goal2'), {
      goalName: '成就「駭客任務」',
      achieved: true,
      progressRate: 1,
    });
  },
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
    await setDoc(doc(db, 'users', `${id}`), {
      uid: id,
      nickname: name,
      email: mail,
      photoURL:
        'https://firebasestorage.googleapis.com/v0/b/cat-vs-dog-738e6.appspot.com/o/photos%2F9v2is0Mb9HS0r8kRiVRqPZKwawI2?alt=media&token=0f033cb8-b8d5-4c9e-94e5-3a57bf7fc72a',
      friends: [],
      changePhotoRight: false,
      inviting: {},
    });
  },
  async getUser(id: string) {
    const user = await getDoc(doc(db, 'users', `${id}`));
    return user.data();
  },
  async updatePhotoURL(id: string, URL: string) {
    await updateDoc(doc(db, 'users', `${id}`), {
      photoURL: URL,
    });
  },
  async updateFriends(id: string, newList: string[]) {
    await updateDoc(doc(db, 'users', `${id}`), {
      friends: newList,
    });
  },
  async updateChangePhotoRight(id: string) {
    await updateDoc(doc(db, 'users', `${id}`), {
      changePhotoRight: true,
    });
  },
  async updateInviting(
    id: string,
    invitation: { nickname: string; URL: string; photoURL: string } | Record<string, never>,
  ) {
    await updateDoc(doc(db, 'users', `${id}`), {
      inviting: invitation,
    });
  },
  async cleanInviting(userEmail: string) {
    let userUid;
    const userQuery = query(collection(db, 'users'), where('email', '==', `${userEmail}`));
    const userDoc = await getDocs(userQuery);
    userDoc.forEach((docs) => {
      const userData = docs.data();
      userUid = userData.uid;
    });
    await updateDoc(doc(db, 'users', `${userUid}`), {
      inviting: {},
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
  async getRoomState(id: string) {
    const roomDoc = await getDoc(doc(db, 'games', `${id}`));
    const Data = roomDoc.data() as { roomState: string };
    return Data.roomState;
  },
  async updateRoomState(roomID: string | undefined, state: string) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      roomState: state,
    });
  },
  async updateDocHost(
    roomID: string,
    hostUid: string,
    hostNickname: string,
    hostEmail: string,
    hostPhotoURL: string,
  ) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      host: {
        uid: hostUid,
        nickname: hostNickname,
        email: hostEmail,
        photoURL: hostPhotoURL,
        hitPoints: 100,
        havePowerUp: true,
        haveHeal: true,
        haveDoubleHit: true,
      },
    });
  },
  async updateDocGuest(
    roomID: string,
    guestUid: string,
    guestNickname: string,
    guestEmail: string,
    guestPhotoURL: string,
  ) {
    await updateDoc(doc(db, 'games', `${roomID}`), {
      guest: {
        uid: guestUid,
        nickname: guestNickname,
        email: guestEmail,
        photoURL: guestPhotoURL,
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
  async setMessage(
    roomID: string,
    identity: string,
    newMessage: {
      identity: string;
      key: number;
      content: string | undefined;
    }[],
  ) {
    if (identity === 'host') {
      await setDoc(doc(db, 'games', `${roomID}`, 'chatRoom', 'host'), {
        messages: newMessage,
      });
    } else if (identity === 'guest') {
      await setDoc(doc(db, 'games', `${roomID}`, 'chatRoom', 'guest'), {
        messages: newMessage,
      });
    }
  },
};

export default firestore;
