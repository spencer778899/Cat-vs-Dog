import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import firestore, { app, db } from '../../utils/firestore';
import Arrow from './arrow.png';

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
      await firestore.updateRoomState(roomID!, 'dogTurn');
    }
    if (catUid === undefined && identity === 'guest') {
      setGuestDocHander();
    }
  });
  return (
    <div>
      <GameScreen>
        <GameCanvasSection>
          <GameWindSpeedBar>
            <GameWindSpeed windSpeed={windSpeedBar || 0} />
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
