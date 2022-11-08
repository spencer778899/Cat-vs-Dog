/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import firestore, { app, db } from '../../utils/firestore';
import Arrow from './arrow.png';
import WaitOpponentModal from './waitOpponentModal';

const GameScreen = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 940px;
  margin: auto;
`;
const GameWindSpeedBar = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  left: 0;
  width: 100px;
  height: 15px;
  margin: auto;
  background-color: #ffffff;
  border: 1px solid #000000;
`;
const GameWindSpeed = styled.div<{ windSpeed: number }>`
  position: absolute;
  right: ${({ windSpeed }) => (windSpeed > 0 ? 'none' : '50px')};
  left: ${({ windSpeed }) => (windSpeed > 0 ? '50px' : 'none')};
  top: 0;
  width: ${({ windSpeed }) => `${Math.abs(windSpeed) * 25}px`};
  height: 100%;
  background-color: red;
`;
const GameDogSkillBox = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50px;
  left: 80px;
  width: 150px;
  height: 30px;
`;
const GameDogPowerUp = styled.div<{ dogHavePowerUp: boolean | undefined }>`
  display: ${(p) => (p.dogHavePowerUp ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #000000;
  border-radius: 50%;
  cursor: pointer;
`;
const GameDogDoubleHit = styled.div<{ dogHaveDoubleHit: boolean | undefined }>`
  display: ${(p) => (p.dogHaveDoubleHit ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #000000;
  border-radius: 50%;
  cursor: pointer;
`;
const GameDogHeal = styled.div<{ dogHaveHeal: boolean | undefined }>`
  display: ${(p) => (p.dogHaveHeal ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #000000;
  border-radius: 50%;
  color: red;
  font-size: 24px;
  cursor: pointer;
`;
const GameCatSkillBox = styled.div`
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50px;
  right: 80px;
  width: 150px;
  height: 30px;
`;
const GameCatPowerUp = styled.div<{ catHavePowerUp: boolean | undefined }>`
  display: ${(p) => (p.catHavePowerUp ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #000000;
  border-radius: 50%;
  cursor: pointer;
`;
const GameCatDoubleHit = styled.div<{ catHaveDoubleHit: boolean | undefined }>`
  display: ${(p) => (p.catHaveDoubleHit ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #000000;
  border-radius: 50%;
  cursor: pointer;
`;
const GameCatHeal = styled.div<{ catHaveHeal: boolean | undefined }>`
  display: ${(p) => (p.catHaveHeal ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #000000;
  border-radius: 50%;
  color: red;
  font-size: 24px;
  cursor: pointer;
`;
const GameCanvasSection = styled.div`
  position: relative;
  width: 940px;
  height: 560px;
`;
const GameCanvas = styled.canvas`
  background: #eee;
  display: block;
  margin: 0 auto;
`;
const GameWhoseTurnMark = styled.div<{ roomState: string | undefined; isDisplayArrow: boolean }>`
  display: ${(p) => (p.isDisplayArrow ? 'block' : 'none')};
  position: absolute;
  top: 380px;
  left: ${(p) => (p.roomState === 'dogTurn' ? '95px' : '829px')};
  width: 21px;
  height: 35px;
  background-image: url(${Arrow});
  background-size: cover;
  animation-duration: 0.7s;
  animation-name: blink;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;
  @keyframes blink {
    0% {
      opacity: 10%;
    }
    20% {
      opacity: 20%;
    }
    40% {
      opacity: 30%;
    }
    60% {
      opacity: 50%;
    }
    80% {
      opacity: 80%;
    }
    100% {
      opacity: 100%;
    }
  }
`;
const GameDogTimer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 440px;
  left: 92px;
  width: 25px;
  height: 40px;
  font-size: 30px;
`;
const GameDog = styled.div`
  position: absolute;
  top: 490px;
  left: 80px;
  width: 50px;
  height: 70px;
  color: #ffffff;
  cursor: pointer;
  background-color: cornflowerblue;
`;
const GameCatTimer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 440px;
  right: 82px;
  width: 25px;
  height: 40px;
  font-size: 30px;
`;
const GameCat = styled.div`
  position: absolute;
  top: 490px;
  left: 820px;
  width: 50px;
  height: 70px;
  color: #ffffff;
  cursor: pointer;
  background-color: cornflowerblue;
`;
const GameDogEnergyBar = styled.div`
  display: none;
  position: absolute;
  left: 55px;
  top: 420px;
  width: 100px;
  height: 13px;
  border: 1px solid black;
  background-color: #ffffff;
  overflow: hidden;
`;
const GameCatEnergyBar = styled.div`
  display: none;
  position: absolute;
  right: 55px;
  top: 420px;
  width: 100px;
  height: 13px;
  border: 1px solid black;
  background-color: #ffffff;
  overflow: hidden;
`;
const GameDogEnergyInner = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: red;
`;
const GameCatEnergyInner = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: red;
`;
const GameDogHitPointsBar = styled.div`
  position: absolute;
  left: 55px;
  top: 20px;
  width: 200px;
  height: 19px;
  border: 1px solid black;
  background-color: #ffffff;
  overflow: hidden;
`;
const GameDogHitPointsInner = styled.div<{ width: number | undefined }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(p) => `${p.width}%`};
  height: 100%;
  background-color: red;
`;
const GameCatHitPointsBar = styled.div`
  position: absolute;
  right: 55px;
  top: 20px;
  width: 200px;
  height: 19px;
  border: 1px solid black;
  background-color: #ffffff;
  overflow: hidden;
`;
const GameCatHitPointsInner = styled.div<{ width: number | undefined }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(p) => `${p.width}%`};
  height: 100%;
  background-color: red;
`;
const GameWall = styled.div`
  position: absolute;
  top: 400px;
  left: 450px;
  width: 40px;
  height: 160px;
  background-color: #000000;
`;

function OnlineGame() {
  const canvas = useRef<HTMLCanvasElement>(null);
  // roomState
  const [identity, setIdentity] = useState<string>();
  const navigate = useNavigate();
  const urlParams = useParams();
  const [roomID, setRoomID] = useState<string | undefined>();
  const [roomState, setRoomState] = useState<string>();
  const [windSpeed, setWindSpeed] = useState<number | undefined>(undefined);
  const [isDisplayArrow, setIsDisplayArrow] = useState(true);
  // dog useState
  const [dogTurnTimeSpent, setDogTurnTimeSpent] = useState<number | undefined>(undefined);
  const [dogUid, setDogUid] = useState();
  const [dogHitPoints, setDogHitPoints] = useState();
  const [dogHavePowerUp, setDogHavePowerUp] = useState();
  const [dogHaveDoubleHit, setDogHaveDoubleHit] = useState();
  const [dogHaveHeal, setDogHaveHeal] = useState();
  const [dogQuantityOfPower, setDogQuantityOfPower] = useState<number>();
  // cat useState
  const [catTurnTimeSpent, setCatTurnTimeSpent] = useState<number | undefined>(undefined);
  const [catUid, setCatUid] = useState();
  const [catHitPoints, setCatHitPoints] = useState();
  const [catHavePowerUp, setCatHavePowerUp] = useState();
  const [catHaveDoubleHit, setCatHaveDoubleHit] = useState();
  const [catHaveHeal, setCatHaveHeal] = useState();
  // roomRef
  const roundCount = useRef(0);
  // dog useRef
  const gameDogRef = useRef<HTMLDivElement>(null);
  const dogEnergyBarRef = useRef<HTMLDivElement>(null);
  const dogEnergyInnerRef = useRef<HTMLDivElement>(null);
  const gameDogPowerUpRef = useRef<HTMLDivElement>(null);
  const gameDogDoubleHitRef = useRef<HTMLDivElement>(null);
  const gameDogHealRef = useRef<HTMLDivElement>(null);
  // cat useRef
  const gameCatRef = useRef<HTMLDivElement>(null);
  const catEnergyBarRef = useRef<HTMLDivElement>(null);
  const catEnergyInnerRef = useRef<HTMLDivElement>(null);
  const gameCatPowerUpRef = useRef<HTMLDivElement>(null);
  const gameCatDoubleHitRef = useRef<HTMLDivElement>(null);
  const gameCatHealRef = useRef<HTMLDivElement>(null);

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
    function subscribeRoom() {
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
      await firestore.updateDocHost('111111', roomID!);
    }
    if (dogUid === undefined && identity === 'host') {
      setHostDocHander();
    }
  });
  // setDoc of guest when guest enter
  useEffect(() => {
    async function setGuestDocHander() {
      await firestore.updateDocGuest('222222', roomID!);
      await firestore.updateRoomState(roomID!, 'dogTurn');
    }
    if (catUid === undefined && identity === 'guest') {
      setGuestDocHander();
    }
  });
  // setNewRound doc before game start
  useEffect(() => {
    async function setNewRound() {
      const isPositive = Math.floor(Math.random() * 2);
      const randomNumber = Math.floor(Math.random() * 5);
      const randomWindSpeed = isPositive ? 0.5 * randomNumber : -0.5 * randomNumber;
      console.log(roundCount.current);
      await firestore.setNewRound(roomID, roundCount.current, randomWindSpeed);
    }
    if (roomState === 'dogTurn' && identity === 'host') {
      roundCount.current += 1;
      setNewRound();
    } else if (roomState === 'dogTurn' && identity === 'guest') {
      roundCount.current += 1;
    }
  }, [roomState]);
  // subscribe round doc
  useEffect(() => {
    function subscribeRound() {
      const roundRef = doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount.current}`);
      const roundSubscriber = onSnapshot(roundRef, (docs) => {
        const data = docs.data();
        setWindSpeed(data?.windSpeed);
        setDogQuantityOfPower(data?.host?.quantityOfPower);
      });
      return () => {
        roundSubscriber();
      };
    }
    if (roomState === 'dogTurn') {
      subscribeRound();
    }
  }, [roomState]);

  // handle game operate
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');

    // setDogTurn
    function setDogTurn() {
      let startTime: number;
      let dogEnergyInnerHandler: NodeJS.Timeout;
      let isMouseDown = false;
      let energy = 0;
      function increaseEnergy() {
        energy += 1;
        if (energy >= 100) {
          clearInterval(dogEnergyInnerHandler);
        }
        dogEnergyInnerRef?.current?.setAttribute('style', `width:${energy}%`);
      }
      function mouseDownHandler() {
        isMouseDown = true;
        setIsDisplayArrow(false);
        setDogTurnTimeSpent(undefined);
        clearInterval(countTimer);
        dogEnergyBarRef?.current?.setAttribute('style', 'display:block');
        dogEnergyInnerHandler = setInterval(increaseEnergy, 20);
        startTime = Number(new Date());
      }
      function getQuantityOfPower(endTime: number) {
        const timeLong = endTime - startTime;
        return timeLong > 2000 ? 10 : 10 * (timeLong / 2000);
      }
      function healHandler() {
        firestore.updateHostHaveHeal(roomID);
        firestore.updateHostHitPoints(roomID, 20);
        firestore.updateRoomState(roomID, 'catTurn');
        removeAllListener();
      }
      function doubleHitHandler() {
        firestore.updateHostHaveDoubleHit(roomID);
        gameDogHealRef.current?.removeEventListener('click', healHandler);
        // gameDogPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
      }
      //     function PowerUpHandler() {
      //       setDogHavePowerUp(false);
      //       dogRadius = 40;
      //       gameDogDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
      //       gameDogHealRef.current?.removeEventListener('click', healHandler);
      //     }
      function mouseUpHandler() {
        if (isMouseDown) {
          const endTime = Number(new Date());
          const quantityOfPower = getQuantityOfPower(endTime);
          console.log(quantityOfPower);
          console.log(roundCount.current);
          firestore.updateHostQuantityOfPower(roomID, roundCount.current, quantityOfPower);
          removeAllListener();
        }
      }
      function removeAllListener() {
        gameDogHealRef.current?.removeEventListener('click', healHandler);
        gameDogDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
        // gameDogPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
        gameDogRef.current?.removeEventListener('mousedown', mouseDownHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        clearInterval(countTimer);
        clearInterval(dogEnergyInnerHandler);
        setDogTurnTimeSpent(undefined);
      }
      let turnTimeSpent = 10;
      function startCountTimer() {
        turnTimeSpent -= 1;
        if (turnTimeSpent === 0) {
          setDogTurnTimeSpent(undefined);
          firestore.updateRoomState(roomID, 'catTurn');
          removeAllListener();
        } else if (turnTimeSpent <= 5) {
          setDogTurnTimeSpent(turnTimeSpent);
        }
      }
      const countTimer = setInterval(startCountTimer, 1000);
      gameDogHealRef.current?.addEventListener('click', healHandler);
      gameDogDoubleHitRef.current?.addEventListener('click', doubleHitHandler);
      // gameDogPowerUpRef.current?.addEventListener('click', PowerUpHandler);
      gameDogRef.current?.addEventListener('mousedown', mouseDownHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }

    // setCatTurn
    function setCatTurn() {
      //     let catX = 840;
      //     let catY = 540;
      //     let catRadius = 20;
      //     let startTime: number;
      //     let timeHandler: NodeJS.Timeout;
      //     let startAnimation: NodeJS.Timeout;
      //     let CatEnergyInnerHandler: NodeJS.Timeout;
      //     let isMouseDown = false;
      //     let time = 1;
      //     let energy = 0;
      //     let hitPointsAvailable = 15;
      //     let windSpeed: number; // -2 ~ 2
      //     function drawCat() {
      //       ctx?.beginPath();
      //       ctx?.arc(catX, catY, catRadius, 0, Math.PI * 2, false);
      //       ctx?.fill();
      //       ctx?.closePath();
      //     }
      //     function increaseEnergy() {
      //       energy += 1;
      //       if (energy >= 100) {
      //         clearInterval(CatEnergyInnerHandler);
      //       }
      //       catEnergyInnerRef?.current?.setAttribute('style', `width:${energy}%`);
      //     }
      //     function mouseDownHandler() {
      //       isMouseDown = true;
      //       setIsDisplayArrow(false);
      //       clearInterval(countTimer);
      //       setCatTurnTimeSpent(undefined);
      //       catEnergyBarRef?.current?.setAttribute('style', 'display:block');
      //       CatEnergyInnerHandler = setInterval(increaseEnergy, 20);
      //       startTime = Number(new Date());
      //     }
      //     function getQuantityOfPower(endTime: number) {
      //       const timeLong = endTime - startTime;
      //       return timeLong > 2000 ? 10 : 10 * (timeLong / 2000);
      //     }
      //     function stopAnimation() {
      //       clearInterval(timeHandler);
      //       clearInterval(startAnimation);
      //     }
      //     function testGameState() {
      //       const currentDogHitPoints = dogHitPoints - hitPointsAvailable;
      //       if (currentDogHitPoints <= 0) {
      //         setRoomState('catWin');
      //       } else {
      //         setRoomState('dogTurn');
      //       }
      //     }
      //     function startAnimationHandler(quantityOfPower: number) {
      //       ctx?.clearRect(0, 0, 940, 560);
      //       drawCat();
      //       // up data cat coordinate
      //       catX -= 10 + quantityOfPower - windSpeed * time;
      //       catY -= 10 + quantityOfPower - time ** 2;
      //       // Is dog cat the cat?
      //       if (catX >= 80 - catRadius && catX <= 130 + catRadius && catY >= 490 - catRadius) {
      //         console.log('hit!');
      //         stopAnimation();
      //         setDogHitPoints((prev) => prev - hitPointsAvailable);
      //         testGameState();
      //         catEnergyBarRef?.current?.setAttribute('style', 'display:none');
      // } else if (catX >= 450 - catRadius && catX <= 490 + catRadius
      // && catY >= 400 - catRadius) {
      //         console.log('miss!');
      //         stopAnimation();
      //         catEnergyBarRef?.current?.setAttribute('style', 'display:none');
      //         setRoomState('dogTurn');
      //       } else if (catY > 580 || catY < 0) {
      //         console.log('miss!');
      //         stopAnimation();
      //         catEnergyBarRef?.current?.setAttribute('style', 'display:none');
      //         setRoomState('dogTurn');
      //       }
      //     }
      //     function healHandler() {
      //       setCatHaveHeal(false);
      //       setCatHitPoints((prev) => prev + 20);
      //       removeAllListener();
      //       setRoomState('dogTurn');
      //     }
      //     function doubleHitHandler() {
      //       setCatHaveDoubleHit(false);
      //       hitPointsAvailable = 30;
      //       gameCatHealRef.current?.removeEventListener('click', healHandler);
      //       gameCatPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
      //     }
      //     function PowerUpHandler() {
      //       setCatHavePowerUp(false);
      //       catRadius = 40;
      //       gameCatDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
      //       gameCatHealRef.current?.removeEventListener('click', healHandler);
      //     }
      //     function mouseUpHandler() {
      //       if (isMouseDown) {
      //         const endTime = Number(new Date());
      //         const quantityOfPower = getQuantityOfPower(endTime);
      //         console.log(quantityOfPower);
      //         clearInterval(CatEnergyInnerHandler);
      //         timeHandler = setInterval(() => {
      //           time += 0.06;
      //         }, 10);
      //         startAnimation = setInterval(() => {
      //           startAnimationHandler(quantityOfPower);
      //         }, 15);
      //         removeAllListener();
      //       }
      //     }
      function removeAllListener() {
        //       gameCatHealRef.current?.removeEventListener('click', healHandler);
        //       gameCatDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
        //       gameCatPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
        //       gameCatRef.current?.removeEventListener('mousedown', mouseDownHandler);
        //       window.removeEventListener('mouseup', mouseUpHandler);
        clearInterval(countTimer);
        //       setCatTurnTimeSpent(undefined);
      }
      let turnTimeSpent = 10;
      function startCountTimer() {
        turnTimeSpent -= 1;
        if (turnTimeSpent === 0) {
          setCatTurnTimeSpent(undefined);
          firestore.updateRoomState(roomID, 'dogTurn');
          removeAllListener();
          clearInterval(countTimer);
        } else if (turnTimeSpent <= 5) {
          setCatTurnTimeSpent(turnTimeSpent);
        }
      }
      const countTimer = setInterval(startCountTimer, 1000);
      //     gameCatHealRef.current?.addEventListener('click', healHandler);
      //     gameCatDoubleHitRef.current?.addEventListener('click', doubleHitHandler);
      //     gameCatPowerUpRef.current?.addEventListener('click', PowerUpHandler);
      //     gameCatRef.current?.addEventListener('mousedown', mouseDownHandler);
      //     window.addEventListener('mouseup', mouseUpHandler);
    }
    setIsDisplayArrow(true);
    if (roomState === 'dogTurn' && identity === 'host') {
      setDogTurn();
    } else if (roomState === 'catTurn' && identity === 'guest') {
      setCatTurn();
    } else if (roomState === 'dogWin' || roomState === 'catWin') {
      alert(roomState);
    }
  }, [roomState]);

  // dog animation handler
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    let dogX = 100;
    let dogY = 540;
    const dogRadius = 20;
    let time = 1;
    const hitPointsAvailable = 15;

    function drawDog() {
      ctx?.beginPath();
      ctx?.arc(dogX, dogY, dogRadius, 0, Math.PI * 2, false);
      ctx?.fill();
      ctx?.closePath();
    }

    function HostDogAnimationHandler() {
      function stopAnimation() {
        clearInterval(timeHandler);
        clearInterval(startAnimation);
      }
      function testGameState() {
        const currentCatHitPoints = catHitPoints! - hitPointsAvailable;
        if (currentCatHitPoints <= 0) {
          firestore.updateRoomState(roomID, 'dogWin');
        } else {
          firestore.updateRoomState(roomID, 'catTurn');
        }
      }
      function startAnimationHandler() {
        ctx?.clearRect(0, 0, 940, 560);
        drawDog();
        // up data dog coordinate
        dogX += 10 + dogQuantityOfPower! + windSpeed! * time;
        dogY -= 10 + dogQuantityOfPower! - time ** 2;
        // Is dog hit the cat?
        if (dogX >= 820 - dogRadius && dogX <= 870 + dogRadius && dogY >= 490 - dogRadius) {
          console.log('hit!');
          stopAnimation();
          firestore.updateGuestHitPoints(roomID, -1 * hitPointsAvailable);
          console.log(roundCount.current);
          firestore.updateHostGetPoints(roomID, roundCount.current, hitPointsAvailable);
          ctx?.clearRect(0, 0, 940, 560);
          testGameState();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
        } else if (dogX >= 450 - dogRadius && dogX <= 490 + dogRadius && dogY >= 400 - dogRadius) {
          console.log('miss!');
          stopAnimation();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
          firestore.updateRoomState(roomID, 'catTurn');
          firestore.updateHostGetPoints(roomID, roundCount.current, 0);
          ctx?.clearRect(0, 0, 940, 560);
        } else if (dogY > 580 || dogY < 0) {
          console.log('miss!');
          stopAnimation();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
          firestore.updateRoomState(roomID, 'catTurn');
          firestore.updateHostGetPoints(roomID, roundCount.current, 0);
          ctx?.clearRect(0, 0, 940, 560);
        }
      }
      const timeHandler = setInterval(() => {
        time += 0.06;
      }, 10);
      const startAnimation = setInterval(() => {
        startAnimationHandler();
      }, 15);
    }

    function guestDogAnimationHandler() {
      function stopAnimation() {
        clearInterval(timeHandler);
        clearInterval(startAnimation);
      }
      function startAnimationHandler() {
        ctx?.clearRect(0, 0, 940, 560);
        drawDog();
        // up data dog coordinate
        dogX += 10 + dogQuantityOfPower! + windSpeed! * time;
        dogY -= 10 + dogQuantityOfPower! - time ** 2;
        // Is dog hit the cat?
        if (dogX >= 820 - dogRadius && dogX <= 870 + dogRadius && dogY >= 490 - dogRadius) {
          console.log('hit!');
          stopAnimation();
          ctx?.clearRect(0, 0, 940, 560);
        } else if (dogX >= 450 - dogRadius && dogX <= 490 + dogRadius && dogY >= 400 - dogRadius) {
          console.log('miss!');
          stopAnimation();
          ctx?.clearRect(0, 0, 940, 560);
        } else if (dogY > 580 || dogY < 0) {
          console.log('miss!');
          stopAnimation();
          ctx?.clearRect(0, 0, 940, 560);
        }
      }
      const timeHandler = setInterval(() => {
        time += 0.06;
      }, 10);
      const startAnimation = setInterval(() => {
        startAnimationHandler();
      }, 15);
    }
    if (dogQuantityOfPower && roomState === 'dogTurn' && identity === 'host') {
      HostDogAnimationHandler();
    } else if (dogQuantityOfPower && roomState === 'dogTurn' && identity === 'guest') {
      guestDogAnimationHandler();
    }
  }, [dogQuantityOfPower]);

  return (
    <div>
      {
        // prettier-ignore
        roomState === 'wait' || roomState === undefined
          ? ReactDOM.createPortal(
            <WaitOpponentModal />,
            document?.getElementById('modal-root') as HTMLElement,
          )
          : ''
      }
      <GameScreen>
        <GameCanvasSection>
          <GameWindSpeedBar>
            <GameWindSpeed windSpeed={windSpeed || 0} />
          </GameWindSpeedBar>
          <GameDogHitPointsBar>
            <GameDogHitPointsInner width={dogHitPoints} />
          </GameDogHitPointsBar>
          <GameDogSkillBox>
            <GameDogPowerUp ref={gameDogPowerUpRef} dogHavePowerUp={dogHavePowerUp}>
              ⚡
            </GameDogPowerUp>
            <GameDogDoubleHit ref={gameDogDoubleHitRef} dogHaveDoubleHit={dogHaveDoubleHit}>
              X2
            </GameDogDoubleHit>
            <GameDogHeal ref={gameDogHealRef} dogHaveHeal={dogHaveHeal}>
              ✚
            </GameDogHeal>
          </GameDogSkillBox>
          <GameCatHitPointsBar>
            <GameCatHitPointsInner width={catHitPoints} />
          </GameCatHitPointsBar>
          <GameCatSkillBox>
            <GameCatPowerUp ref={gameCatPowerUpRef} catHavePowerUp={catHavePowerUp}>
              ⚡
            </GameCatPowerUp>
            <GameCatDoubleHit ref={gameCatDoubleHitRef} catHaveDoubleHit={catHaveDoubleHit}>
              X2
            </GameCatDoubleHit>
            <GameCatHeal ref={gameCatHealRef} catHaveHeal={catHaveHeal}>
              ✚
            </GameCatHeal>
          </GameCatSkillBox>
          <GameCanvas width={940} height={560} ref={canvas} />
        </GameCanvasSection>
        <GameDogEnergyBar ref={dogEnergyBarRef}>
          <GameDogEnergyInner ref={dogEnergyInnerRef} />
        </GameDogEnergyBar>
        <GameCatEnergyBar ref={catEnergyBarRef}>
          <GameCatEnergyInner ref={catEnergyInnerRef} />
        </GameCatEnergyBar>
        <GameWhoseTurnMark roomState={roomState} isDisplayArrow={isDisplayArrow} />
        <GameDogTimer>{dogTurnTimeSpent}</GameDogTimer>
        <GameDog ref={gameDogRef}>dog</GameDog>
        <GameCatTimer>{catTurnTimeSpent}</GameCatTimer>
        <GameCat ref={gameCatRef}>cat</GameCat>
        <GameWall />
      </GameScreen>
    </div>
  );
}

export default OnlineGame;
