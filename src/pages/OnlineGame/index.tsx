import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import firestore, { app, db } from '../../utils/firestore';

function OnlineGame() {
  const canvas = useRef<HTMLCanvasElement>(null);
  // roomState
  const [identity, setIdentity] = useState<string>();
  const navigate = useNavigate();
  const urlParams = useParams();
  const [roomID, setRoomID] = useState<string>();
  const [roomState, setRoomState] = useState();
  const [windSpeedBar, setWindSpeedBar] = useState<number | undefined>(undefined);
  const [isDisplayArrow, setIsDisplayArrow] = useState(true);
  // dog useState
  const [dogTurnTimeSpent, setDogTurnTimeSpent] = useState<number | undefined>(undefined);
  const [dogUid, setDogUid] = useState();
  const [dogHitPoints, setDogHitPoints] = useState();
  const [dogHavePowerUp, setDogHavePowerUp] = useState();
  const [dogHaveDoubleHit, setDogHaveDoubleHit] = useState();
  const [dogHaveHeal, setDogHaveHeal] = useState();
  // cat useState
  const [catTurnTimeSpent, setCatTurnTimeSpent] = useState<number | undefined>(undefined);
  const [catUid, setCatUid] = useState();
  const [catHitPoints, setCatHitPoints] = useState();
  const [catHavePowerUp, setCatHavePowerUp] = useState();
  const [catHaveDoubleHit, setCatHaveDoubleHit] = useState();
  const [catHaveHeal, setCatHaveHeal] = useState();

  console.log('roomState', roomState);
  console.log('dogHitPoints', dogHitPoints);
  console.log('dogHavePowerUp', dogHavePowerUp);
  console.log('dogHaveDoubleHit', dogHaveDoubleHit);
  console.log('dogHaveHeal', dogHaveHeal);
  console.log('catHitPoints', catHitPoints);
  console.log('catHavePowerUp', catHavePowerUp);
  console.log('catHaveDoubleHit', catHaveDoubleHit);
  console.log('catHaveHeal', catHaveHeal);
  console.log('----------------------------------------------');

  // If room isn't exist,create a new one
  useEffect(() => {
    async function createNewRoom() {
      const resRoomID = await firestore.setDocRoomID();
      setRoomID(resRoomID);
      navigate(`/onlinegame/${resRoomID}/host`);
    }
    if (!urlParams.roomID) {
      createNewRoom();
    } else {
      setRoomID(urlParams.roomID);
      setIdentity(urlParams.identity);
    }
  });
  // subscribe room
  useEffect(() => {
    async function subscribeRoom() {
      const roomStateRef = doc(db, 'games', `${roomID}`);
      const roomStateSubscriber = onSnapshot(roomStateRef, (docs) => {
        const data = docs.data();
        setRoomState(data?.roomState);
        setDogUid(data?.host?.uid);
        setDogHitPoints(data?.host?.hitPoints);
        setDogHavePowerUp(data?.host?.havePowerUp);
        setDogHaveDoubleHit(data?.host?.haveDoubleHit);
        setDogHaveHeal(data?.host?.haveHeal);
        setCatUid(data?.guest?.uid);
        setCatHitPoints(data?.guest?.hitPoints);
        setCatHavePowerUp(data?.guest?.havePowerUp);
        setCatHaveDoubleHit(data?.guest?.haveDoubleHit);
        setCatHaveHeal(data?.guest?.haveHeal);
      });
      return () => {
        roomStateSubscriber();
      };
    }
    if (roomID) {
      subscribeRoom();
    }
  }, [roomID]);
  // updateDoc of host when host enter
  useEffect(() => {
    async function setHostDocHander() {
      await firestore.updateDocHost('11111', roomID!);
    }
    if (dogUid === undefined && identity === 'host') {
      setHostDocHander();
    }
  });
  // setDoc of guest when guest enter
  useEffect(() => {
    async function setGuestDocHander() {
      await firestore.updateDocGuest('222222', roomID!);
      await firestore.updateRoomState(roomID!, 'gaming');
    }
    if (catUid === undefined && identity === 'guest') {
      setGuestDocHander();
    }
  });
  return <div>Online Game</div>;
}

export default OnlineGame;
