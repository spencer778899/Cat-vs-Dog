/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import { doc, onSnapshot } from 'firebase/firestore';
import firestore, { db } from '../../utils/firestore';
import Arrow from '../../img/arrow.png';
import WaitOpponentModal from './waitOpponentModal';
import GameoverModal from '../../components/gameoverModal';
import GamePreloadBackgroundImg from '../../components/gamePreloadBackgroundImg';
import screenImg from '../../img/gamepage/game_screen.png';
import powerUpImg from '../../img/gamepage/game_powerUp.png';
import X2Img from '../../img/gamepage/game_X2.png';
import healImg from '../../img/gamepage/game_heal.png';
import hitPointsBarImg from '../../img/gamepage/game_hitPointsBar.png';
import windBarImg from '../../img/gamepage/game_windBar.png';
import dogImg from '../../img/gamepage/game_dog.png';
import dogAttackImg from '../../img/gamepage/game_dogAttack.png';
import dogInjuriedImg from '../../img/gamepage/game_dogInjuried.png';
import dogMissImg from '../../img/gamepage/game_dogMiss.png';
import catImg from '../../img/gamepage/game_cat.png';
import catAttackImg from '../../img/gamepage/game_catAttack.png';
import catInjuriedImg from '../../img/gamepage/game_catInjuried.png';
import catMissImg from '../../img/gamepage/game_catMiss.png';
import closeImg from '../../img/close.png';

const swing = keyframes`
  0%{background-position:center}
  50%{background-position:35%}
  100%{background-position:center}
`;
const swingAnimation = css`
  animation: ${swing} 1s linear infinite;
`;
const GameBody = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 940px;
  height: 560px;
  margin: auto;
`;
const GameScreen = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 940px;
  height: 560px;
  margin: auto;
`;
const GameControlPanel = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  height: 120px;
  width: 90%;
  margin: auto;
`;
const GameWindSpeedBox = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  width: 157px;
  height: 50px;
`;
const GameWindSpeedImg = styled.img`
  position: relative;
  width: 100%;
  height: 100%;
`;
const GameWindSpeedBar = styled.div`
  position: absolute;
  top: 31px;
  right: 0;
  left: 0;
  width: 100px;
  height: 12px;
  margin: auto;
`;
const GameWindSpeed = styled.div<{ windSpeed: number }>`
  position: absolute;
  right: ${({ windSpeed }) => (windSpeed > 0 ? 'none' : '50px')};
  left: ${({ windSpeed }) => (windSpeed > 0 ? '50px' : 'none')};
  top: 0;
  width: ${({ windSpeed }) => `${Math.abs(windSpeed) * 25}px`};
  height: 100%;
  background-color: blue;
`;
const GameHitPointsImg = styled.img`
  position: absolute;
  top: 0;
  width: 100%;
  height: 60px;
  z-index: 10;
`;
const GameDogHitPointsBar = styled.div`
  position: absolute;
  right: 13px;
  top: 40px;
  width: 350px;
  height: 15px;
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
  z-index: 9;
  transition: linear 0.5s;
`;
const GameCatHitPointsBar = styled.div`
  position: absolute;
  left: 10px;
  top: 40px;
  width: 350px;
  height: 15px;
  background-color: #ffffff;
  overflow: hidden;
`;
const GameCatHitPointsInner = styled.div<{ width: number | undefined }>`
  position: absolute;
  right: 0;
  top: 0;
  width: ${(p) => `${p.width}%`};
  height: 100%;
  background-color: red;
  transition: linear 0.5s;
  z-index: 9;
`;
const GameDogSkillBox = styled.div`
  position: absolute;
  bottom: 10px;
  right: 65px;
  width: 180px;
  height: 40px;
`;
const GameSkillBox = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  margin-right: 20px;
`;
const GameDogPowerUp = styled.div<{ dogHavePowerUp: boolean | undefined }>`
  display: ${(p) => (p.dogHavePowerUp ? 'relative' : 'none')};
  width: 40px;
  height: 40px;
  background-image: url(${powerUpImg});
  background-size: cover;
  cursor: pointer;
`;
const GameDogDoubleHit = styled.div<{ dogHaveDoubleHit: boolean | undefined }>`
  display: ${(p) => (p.dogHaveDoubleHit ? 'relative' : 'none')};
  width: 40px;
  height: 40px;

  background-image: url(${X2Img});
  background-size: cover;
  cursor: pointer;
`;
const GameDogHeal = styled.div<{ dogHaveHeal: boolean | undefined }>`
  display: ${(p) => (p.dogHaveHeal ? 'relative' : 'none')};
  width: 40px;
  height: 40px;
  background-image: url(${healImg});
  background-size: cover;
  color: red;
  font-size: 24px;
  cursor: pointer;
`;
const GameCatSkillBox = styled.div`
  position: absolute;
  bottom: 10px;
  left: 65px;
  width: 180px;
  height: 40px;
`;
const GameCatPowerUp = styled.div<{ catHavePowerUp: boolean | undefined }>`
  display: ${(p) => (p.catHavePowerUp ? 'relative' : 'none')};
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-image: url(${powerUpImg});
  background-size: cover;
  cursor: pointer;
`;
const GameCatDoubleHit = styled.div<{ catHaveDoubleHit: boolean | undefined }>`
  display: ${(p) => (p.catHaveDoubleHit ? 'relative' : 'none')};
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-image: url(${X2Img});
  background-size: cover;
  cursor: pointer;
`;
const GameCatHeal = styled.div<{ catHaveHeal: boolean | undefined }>`
  display: ${(p) => (p.catHaveHeal ? 'relative' : 'none')};
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-image: url(${healImg});
  background-size: cover;
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
  background: url(${screenImg});
  background-size: cover;
  display: block;
  margin: 0 auto;
`;
const GameWhoseTurnMark = styled.div<{ roomState: string | undefined; isDisplayArrow: boolean }>`
  display: ${(p) => (p.isDisplayArrow ? 'block' : 'none')};
  position: absolute;
  top: 400px;
  left: ${(p) => (p.roomState === 'dogTurn' ? '829px' : '75px')};
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
  top: 350px;
  right: 88px;
  width: 25px;
  height: 40px;
  font-size: 30px;
`;
const GameDog = styled.div<{ roomState: string | undefined }>`
  position: absolute;
  bottom: 0;
  right: 40px;
  width: 130px;
  height: 130px;
  background-image: url(${(p) => (p.roomState === 'dogTurn' ? dogAttackImg : dogImg)});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  ${(p) => (p.roomState === 'catTurn' ? swingAnimation : 'none')}
`;
const GameCatTimer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 350px;
  left: 73px;
  width: 25px;
  height: 40px;
  font-size: 30px;
`;
const GameCat = styled.div<{ roomState: string | undefined }>`
  position: absolute;
  bottom: 0;
  left: 40px;
  width: 120px;
  height: 130px;
  background-image: url(${(p) => (p.roomState === 'catTurn' ? catAttackImg : catImg)});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  ${(p) => (p.roomState === 'dogTurn' ? swingAnimation : 'none')}
`;
const GameDogEnergyBar = styled.div`
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
const GameCatEnergyBar = styled.div`
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
  const [dogRadius, setDogRadius] = useState<number>();
  const [dogHitPointsAvailable, setDogHitPointsAvailable] = useState<number>();
  // cat useState
  const [catTurnTimeSpent, setCatTurnTimeSpent] = useState<number | undefined>(undefined);
  const [catUid, setCatUid] = useState();
  const [catHitPoints, setCatHitPoints] = useState();
  const [catHavePowerUp, setCatHavePowerUp] = useState();
  const [catHaveDoubleHit, setCatHaveDoubleHit] = useState();
  const [catHaveHeal, setCatHaveHeal] = useState();
  const [catQuantityOfPower, setCatQuantityOfPower] = useState<number>();
  const [catRadius, setCatRadius] = useState<number>();
  const [catHitPointsAvailable, setCatHitPointsAvailable] = useState<number>();
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
  }, [roomID]);
  // updateDoc of host when host enter
  useEffect(() => {
    async function setHostDocHandler(id: string) {
      await firestore.updateDocHost('111111', id);
    }
    if (dogUid === undefined && identity === 'host' && roomID) {
      setHostDocHandler(roomID);
    }
  });
  // setDoc of guest when guest enter
  useEffect(() => {
    async function setGuestDocHandler(id: string) {
      await firestore.updateDocGuest('222222', id);
      await firestore.updateRoomState(id, 'dogTurn');
    }
    if (catUid === undefined && identity === 'guest' && roomID) {
      setGuestDocHandler(roomID);
    }
  });
  // setNewRound doc before game start
  useEffect(() => {
    async function setNewRound() {
      const isPositive = Math.floor(Math.random() * 2);
      const randomNumber = Math.floor(Math.random() * 5);
      const randomWindSpeed = isPositive ? 0.5 * randomNumber : -0.5 * randomNumber;
      await firestore.setNewRound(roomID, roundCount.current, randomWindSpeed);
    }
    if (roomState === 'dogTurn' && identity === 'host') {
      roundCount.current += 1;
      setNewRound();
    } else if (roomState === 'dogTurn' && identity === 'guest') {
      roundCount.current += 1;
    }
  }, [roomState, roomID, identity]);
  // subscribe round doc
  useEffect(() => {
    const roundRef = doc(db, 'games', `${roomID}`, 'scoreboard', `round${roundCount.current}`);
    const roundSubscriber = onSnapshot(roundRef, (docs) => {
      const data = docs.data();
      setWindSpeed(data?.windSpeed);
      setDogQuantityOfPower(data?.host?.quantityOfPower);
      setDogRadius(data?.host?.radius);
      setDogHitPointsAvailable(data?.host?.hitPointsAvailable);
      setCatQuantityOfPower(data?.guest?.quantityOfPower);
      setCatRadius(data?.guest?.radius);
      setCatHitPointsAvailable(data?.guest?.hitPointsAvailable);
    });
    return () => {
      roundSubscriber();
    };
  }, [roomState, roomID]);

  // handle game operate
  useEffect(() => {
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
          window.removeEventListener('mouseup', mouseUpHandler);
          mouseUpHandler();
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
        firestore.updateHostHaveDoubleHit(roomID, roundCount.current);
        gameDogHealRef.current?.removeEventListener('click', healHandler);
        gameDogPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
      }
      function PowerUpHandler() {
        firestore.updateHostHavePowerUp(roomID, roundCount.current);
        gameDogDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
        gameDogHealRef.current?.removeEventListener('click', healHandler);
      }
      function mouseUpHandler() {
        if (isMouseDown) {
          const endTime = Number(new Date());
          const quantityOfPower = getQuantityOfPower(endTime);
          console.log(quantityOfPower);
          firestore.updateHostQuantityOfPower(roomID, roundCount.current, quantityOfPower);
          removeAllListener();
        }
      }
      function removeAllListener() {
        gameDogHealRef.current?.removeEventListener('click', healHandler);
        gameDogDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
        gameDogPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
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
      gameDogPowerUpRef.current?.addEventListener('click', PowerUpHandler);
      gameDogRef.current?.addEventListener('mousedown', mouseDownHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }
    // setCatTurn
    function setCatTurn() {
      let startTime: number;
      let catEnergyInnerHandler: NodeJS.Timeout;
      let isMouseDown = false;
      let energy = 0;
      function increaseEnergy() {
        energy += 1;
        if (energy >= 100) {
          clearInterval(catEnergyInnerHandler);
          window.removeEventListener('mouseup', mouseUpHandler);
          mouseUpHandler();
        }
        catEnergyInnerRef?.current?.setAttribute('style', `width:${energy}%`);
      }
      function mouseDownHandler() {
        isMouseDown = true;
        setIsDisplayArrow(false);
        setCatTurnTimeSpent(undefined);
        clearInterval(countTimer);
        catEnergyBarRef?.current?.setAttribute('style', 'display:block');
        catEnergyInnerHandler = setInterval(increaseEnergy, 20);
        startTime = Number(new Date());
      }
      function getQuantityOfPower(endTime: number) {
        const timeLong = endTime - startTime;
        return timeLong > 2000 ? 10 : 10 * (timeLong / 2000);
      }
      function healHandler() {
        firestore.updateGuestHaveHeal(roomID);
        firestore.updateGuestHitPoints(roomID, 20);
        firestore.updateRoomState(roomID, 'dogTurn');
        removeAllListener();
      }
      function doubleHitHandler() {
        firestore.updateGuestHaveDoubleHit(roomID, roundCount.current);
        gameCatHealRef.current?.removeEventListener('click', healHandler);
        gameCatPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
      }
      function PowerUpHandler() {
        firestore.updateGuestHavePowerUp(roomID, roundCount.current);
        gameCatDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
        gameCatHealRef.current?.removeEventListener('click', healHandler);
      }
      function mouseUpHandler() {
        if (isMouseDown) {
          const endTime = Number(new Date());
          const quantityOfPower = getQuantityOfPower(endTime);
          console.log(quantityOfPower);
          firestore.updateGuestQuantityOfPower(roomID, roundCount.current, quantityOfPower);
          removeAllListener();
        }
      }
      function removeAllListener() {
        gameCatHealRef.current?.removeEventListener('click', healHandler);
        gameCatDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
        gameCatPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
        gameCatRef.current?.removeEventListener('mousedown', mouseDownHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        clearInterval(countTimer);
        clearInterval(catEnergyInnerHandler);
        setCatTurnTimeSpent(undefined);
      }
      let turnTimeSpent = 10;
      function startCountTimer() {
        turnTimeSpent -= 1;
        if (turnTimeSpent === 0) {
          setCatTurnTimeSpent(undefined);
          firestore.updateRoomState(roomID, 'dogTurn');
          removeAllListener();
        } else if (turnTimeSpent <= 5) {
          setCatTurnTimeSpent(turnTimeSpent);
        }
      }
      const countTimer = setInterval(startCountTimer, 1000);
      gameCatHealRef.current?.addEventListener('click', healHandler);
      gameCatDoubleHitRef.current?.addEventListener('click', doubleHitHandler);
      gameCatPowerUpRef.current?.addEventListener('click', PowerUpHandler);
      gameCatRef.current?.addEventListener('mousedown', mouseDownHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }
    setIsDisplayArrow(true);
    if (roomState === 'dogTurn' && identity === 'host') {
      setDogTurn();
    } else if (roomState === 'catTurn' && identity === 'guest') {
      setCatTurn();
    }
  }, [roomState, roomID, identity]);

  // dog animation handler
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    let dogX = 840;
    let dogY = 540;
    let time = 1;

    function delay(sec: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, sec);
      });
    }

    function drawDog(radius: number) {
      ctx?.beginPath();
      ctx?.arc(dogX, dogY, radius, 0, Math.PI * 2, false);
      ctx?.fill();
      ctx?.closePath();
    }

    function hostDogAnimationHandler(
      wind: number,
      quantityOfPower: number,
      radius: number,
      hitPointsAvailable: number,
      opponentHitPoints: number,
    ) {
      function stopAnimation() {
        clearInterval(timeHandler);
        clearInterval(startAnimation);
      }
      function testGameState() {
        const currentCatHitPoints = opponentHitPoints - hitPointsAvailable;
        if (currentCatHitPoints <= 0) {
          firestore.updateRoomState(roomID, 'dogWin');
        } else {
          firestore.updateRoomState(roomID, 'catTurn');
        }
      }
      async function startAnimationHandler() {
        ctx?.clearRect(0, 0, 940, 560);
        drawDog(radius);
        // up data dog coordinate
        dogX -= 10 + quantityOfPower - wind * time;
        dogY -= 10 + quantityOfPower - time ** 2;
        // Is dog hit the cat?
        if (dogX >= 80 - radius && dogX <= 130 + radius && dogY >= 490 - radius) {
          console.log('hit!');
          stopAnimation();
          firestore.updateGuestHitPoints(roomID, -1 * hitPointsAvailable);
          firestore.updateHostGetPoints(roomID, roundCount.current, hitPointsAvailable);
          ctx?.clearRect(0, 0, 940, 560);
          gameCatRef?.current?.setAttribute('style', `background-image:url(${catInjuriedImg})`);
          await delay(1000);
          gameCatRef?.current?.setAttribute('style', '');
          testGameState();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
        } else if (
          (dogX >= 450 - radius && dogX <= 490 + radius && dogY >= 400 - radius) ||
          dogY > 580 ||
          dogY < 0
        ) {
          console.log('miss!');
          stopAnimation();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
          firestore.updateRoomState(roomID, 'catTurn');
          firestore.updateHostGetPoints(roomID, roundCount.current, 0);
          ctx?.clearRect(0, 0, 940, 560);
          gameCatRef?.current?.setAttribute('style', `background-image:url(${catMissImg})`);
          await delay(1000);
          gameCatRef?.current?.setAttribute('style', '');
        }
      }
      const timeHandler = setInterval(() => {
        time += 0.06;
      }, 10);
      const startAnimation = setInterval(() => {
        startAnimationHandler();
      }, 15);
    }

    function guestDogAnimationHandler(wind: number, quantityOfPower: number, radius: number) {
      function stopAnimation() {
        clearInterval(timeHandler);
        clearInterval(startAnimation);
      }
      async function startAnimationHandler() {
        ctx?.clearRect(0, 0, 940, 560);
        console.log(quantityOfPower, wind, radius);
        drawDog(radius);
        // up data dog coordinate
        dogX -= 10 + quantityOfPower - wind * time;
        dogY -= 10 + quantityOfPower - time ** 2;
        // Is dog hit the cat?
        if (dogX >= 80 - radius && dogX <= 130 + radius && dogY >= 490 - radius) {
          console.log('hit!');
          stopAnimation();
          ctx?.clearRect(0, 0, 940, 560);
          gameCatRef?.current?.setAttribute('style', `background-image:url(${catInjuriedImg})`);
          await delay(1000);
          gameCatRef?.current?.setAttribute('style', '');
        } else if (
          (dogX >= 450 - radius && dogX <= 490 + radius && dogY >= 400 - radius) ||
          dogY > 580 ||
          dogY < 0
        ) {
          console.log('miss!');
          stopAnimation();
          ctx?.clearRect(0, 0, 940, 560);
          gameCatRef?.current?.setAttribute('style', `background-image:url(${catMissImg})`);
          await delay(1000);
          gameCatRef?.current?.setAttribute('style', '');
        }
      }
      const timeHandler = setInterval(() => {
        time += 0.06;
      }, 10);
      const startAnimation = setInterval(() => {
        startAnimationHandler();
      }, 15);
    }
    if (
      roomState === 'dogTurn' &&
      identity === 'host' &&
      windSpeed &&
      dogQuantityOfPower &&
      dogRadius &&
      dogHitPointsAvailable &&
      catHitPoints
    ) {
      hostDogAnimationHandler(
        windSpeed,
        dogQuantityOfPower,
        dogRadius,
        dogHitPointsAvailable,
        catHitPoints,
      );
    } else if (
      roomState === 'dogTurn' &&
      identity === 'guest' &&
      windSpeed &&
      dogQuantityOfPower &&
      dogRadius
    ) {
      guestDogAnimationHandler(windSpeed, dogQuantityOfPower, dogRadius);
    }
  }, [dogQuantityOfPower]);

  // cat animation handler
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    let catX = 100;
    let catY = 540;
    let time = 1;

    function delay(sec: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, sec);
      });
    }

    function drawCat(radius: number) {
      ctx?.beginPath();
      ctx?.arc(catX, catY, radius, 0, Math.PI * 2, false);
      ctx?.fill();
      ctx?.closePath();
    }

    function guestCatAnimationHandler(
      wind: number,
      quantityOfPower: number,
      radius: number,
      hitPointsAvailable: number,
      opponentHitPoints: number,
    ) {
      function stopAnimation() {
        clearInterval(timeHandler);
        clearInterval(startAnimation);
      }
      function testGameState() {
        const currentDogHitPoints = opponentHitPoints - hitPointsAvailable;
        if (currentDogHitPoints <= 0) {
          firestore.updateRoomState(roomID, 'catWin');
        } else {
          firestore.updateRoomState(roomID, 'dogTurn');
        }
      }
      async function startAnimationHandler() {
        ctx?.clearRect(0, 0, 940, 560);
        drawCat(radius);
        catX += 10 + quantityOfPower + wind * time;
        catY -= 10 + quantityOfPower - time ** 2;
        if (catX >= 820 - radius && catX <= 870 + radius && catY >= 490 - radius) {
          console.log('hit!');
          stopAnimation();
          firestore.updateHostHitPoints(roomID, -1 * hitPointsAvailable);
          firestore.updateGuestGetPoints(roomID, roundCount.current, hitPointsAvailable);
          ctx?.clearRect(0, 0, 940, 560);
          gameDogRef?.current?.setAttribute('style', `background-image:url(${dogInjuriedImg})`);
          await delay(1000);
          gameDogRef?.current?.setAttribute('style', '');
          testGameState();
          catEnergyBarRef?.current?.setAttribute('style', 'display:none');
        } else if (
          (catX >= 450 - radius && catX <= 490 + radius && catY >= 400 - radius) ||
          catY > 580 ||
          catY < 0
        ) {
          console.log('miss!');
          stopAnimation();
          catEnergyBarRef?.current?.setAttribute('style', 'display:none');
          firestore.updateRoomState(roomID, 'dogTurn');
          firestore.updateGuestGetPoints(roomID, roundCount.current, 0);
          ctx?.clearRect(0, 0, 940, 560);
          gameDogRef?.current?.setAttribute('style', `background-image:url(${dogMissImg})`);
          await delay(1000);
          gameDogRef?.current?.setAttribute('style', '');
        }
      }
      const timeHandler = setInterval(() => {
        time += 0.06;
      }, 10);
      const startAnimation = setInterval(() => {
        startAnimationHandler();
      }, 15);
    }

    function hostCatAnimationHandler(wind: number, quantityOfPower: number, radius: number) {
      function stopAnimation() {
        clearInterval(timeHandler);
        clearInterval(startAnimation);
      }
      async function startAnimationHandler() {
        ctx?.clearRect(0, 0, 940, 560);
        drawCat(radius);
        catX += 10 + quantityOfPower + wind * time;
        catY -= 10 + quantityOfPower - time ** 2;
        if (catX >= 820 - radius && catX <= 870 + radius && catY >= 490 - radius) {
          console.log('hit!');
          stopAnimation();
          ctx?.clearRect(0, 0, 940, 560);
          gameDogRef?.current?.setAttribute('style', `background-image:url(${dogInjuriedImg})`);
          await delay(1000);
          gameDogRef?.current?.setAttribute('style', '');
        } else if (
          (catX >= 450 - radius && catX <= 490 + radius && catY >= 400 - radius) ||
          catY > 580 ||
          catY < 0
        ) {
          console.log('miss!');
          stopAnimation();
          ctx?.clearRect(0, 0, 940, 560);
          gameDogRef?.current?.setAttribute('style', `background-image:url(${dogMissImg})`);
          await delay(1000);
          gameDogRef?.current?.setAttribute('style', '');
        }
      }
      const timeHandler = setInterval(() => {
        time += 0.06;
      }, 10);
      const startAnimation = setInterval(() => {
        startAnimationHandler();
      }, 15);
    }

    if (
      roomState === 'catTurn' &&
      identity === 'guest' &&
      windSpeed &&
      catQuantityOfPower &&
      catRadius &&
      catHitPointsAvailable &&
      dogHitPoints
    ) {
      guestCatAnimationHandler(
        windSpeed,
        catQuantityOfPower,
        catRadius,
        catHitPointsAvailable,
        dogHitPoints,
      );
    } else if (
      roomState === 'catTurn' &&
      identity === 'host' &&
      windSpeed &&
      catQuantityOfPower &&
      catRadius
    ) {
      hostCatAnimationHandler(windSpeed, catQuantityOfPower, catRadius);
    }
  }, [catQuantityOfPower]);

  return (
    <GameBody>
      <GamePreloadBackgroundImg />
      <GameScreen>
        {
          // prettier-ignore
          roomState === 'wait' || roomState === undefined ?
            ReactDOM.createPortal(
              <WaitOpponentModal />,
            document?.getElementById('modal-root') as HTMLElement,
            ) : ''
        }
        {
          // prettier-ignore
          roomState === 'dogWin' || roomState === 'catWin' ? ReactDOM.createPortal(
            <GameoverModal roomState={roomState} />,
            document?.getElementById('modal-root') as HTMLElement,
          ) : ''
        }
        <GameCanvasSection>
          <GameControlPanel>
            <GameWindSpeedBox>
              <GameWindSpeedImg src={windBarImg} />
              <GameWindSpeedBar>
                <GameWindSpeed windSpeed={windSpeed || 0} />
              </GameWindSpeedBar>
            </GameWindSpeedBox>
            <GameHitPointsImg src={hitPointsBarImg} />
            <GameDogHitPointsBar>
              <GameDogHitPointsInner width={dogHitPoints} />
            </GameDogHitPointsBar>
            <GameCatHitPointsBar>
              <GameCatHitPointsInner width={catHitPoints} />
            </GameCatHitPointsBar>
            <GameDogSkillBox>
              <GameSkillBox>
                <GameDogPowerUp ref={gameDogPowerUpRef} dogHavePowerUp={dogHavePowerUp} />
              </GameSkillBox>
              <GameSkillBox>
                <GameDogDoubleHit ref={gameDogDoubleHitRef} dogHaveDoubleHit={dogHaveDoubleHit} />
              </GameSkillBox>
              <GameSkillBox>
                <GameDogHeal ref={gameDogHealRef} dogHaveHeal={dogHaveHeal} />
              </GameSkillBox>
            </GameDogSkillBox>
            <GameCatSkillBox>
              <GameSkillBox>
                <GameCatPowerUp ref={gameCatPowerUpRef} catHavePowerUp={catHavePowerUp} />
              </GameSkillBox>
              <GameSkillBox>
                <GameCatDoubleHit ref={gameCatDoubleHitRef} catHaveDoubleHit={catHaveDoubleHit} />
              </GameSkillBox>
              <GameSkillBox>
                <GameCatHeal ref={gameCatHealRef} catHaveHeal={catHaveHeal} />
              </GameSkillBox>
            </GameCatSkillBox>
          </GameControlPanel>

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
        <GameDog ref={gameDogRef} roomState={roomState} />
        <GameCatTimer>{catTurnTimeSpent}</GameCatTimer>
        <GameCat ref={gameCatRef} roomState={roomState} />
      </GameScreen>
    </GameBody>
  );
}

export default OnlineGame;
