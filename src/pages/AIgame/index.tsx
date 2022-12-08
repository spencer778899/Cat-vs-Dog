/* eslint-disable no-use-before-define */
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes, css } from 'styled-components';
import GameoverModal from '../../components/gameoverModal';
import { useGlobalContext } from '../../context/authContext';
import firestore from '../../utils/firestore';
import SelectLevelModel from './selectLevelModal';
import ExitModal from '../../components/exitModal';
import GamePreloadBackgroundImg from '../../components/gamePreloadBackgroundImg';
import imageHub from '../../utils/imageHub';

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
  box-shadow: 0 0 20px #00000090;
  @media (max-width: 1125px) {
    display: none;
  }
`;
const GameBack = styled.div`
  position: absolute;
  top: -30px;
  right: 5px;
  width: 27px;
  height: 27px;
  background-image: url(${imageHub.closeImg});
  background-size: cover;
  opacity: 40%;
  z-index: 1;
  cursor: pointer;
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
const GameWindDirectionArrow = styled.div<{ windSpeed: number }>`
  display: ${(p) => (p.windSpeed ? 'relative' : 'none')};
  position: absolute;
  top: 8px;
  right: ${(p) => (p.windSpeed > 0 ? '10px' : '115px')}; // 10、115
  width: 30px;
  height: 10px;
  background-image: url(${imageHub.windArrow});
  background-size: cover;
  transform: ${(p) => (p.windSpeed > 0 ? 'none' : 'rotate(180deg)')};
  z-index: 1;
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
  height: 12.5px;
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
  z-index: 2;
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
const GameDogHitPointsInner = styled.div<{ width: number }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(p) => `${p.width}%`};
  height: 100%;
  background-color: red;
  z-index: 1;
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
const GameCatHitPointsInner = styled.div<{ width: number }>`
  position: absolute;
  right: 0;
  top: 0;
  width: ${(p) => `${p.width}%`};
  height: 100%;
  background-color: red;
  transition: linear 0.5s;
  z-index: 1;
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
const GameDogPowerUp = styled.div<{ dogHavePowerUp: boolean }>`
  display: ${(p) => (p.dogHavePowerUp ? 'relative' : 'none')};
  width: 40px;
  height: 40px;
  background-image: url(${imageHub.powerUpImg});
  background-size: cover;
  cursor: pointer;
`;
const GameDogDoubleHit = styled.div<{ dogHaveDoubleHit: boolean }>`
  display: ${(p) => (p.dogHaveDoubleHit ? 'relative' : 'none')};
  width: 40px;
  height: 40px;

  background-image: url(${imageHub.doubleHitImg});
  background-size: cover;
  cursor: pointer;
`;
const GameDogHeal = styled.div<{ dogHaveHeal: boolean }>`
  display: ${(p) => (p.dogHaveHeal ? 'relative' : 'none')};
  width: 40px;
  height: 40px;
  background-image: url(${imageHub.healImg});
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
  background: url(${imageHub.screenImg});
  background-size: cover;
  display: block;
  margin: 0 auto;
`;
const GameWhoseTurnMark = styled.div<{ roomState: string; isDisplayArrow: boolean }>`
  display: ${(p) => (p.isDisplayArrow ? 'block' : 'none')};
  position: absolute;
  top: 400px;
  left: ${(p) => (p.roomState === 'dogTurn' ? '829px' : '75px')};
  width: 21px;
  height: 35px;
  background-image: url(${imageHub.Arrow});
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
const { dogAttackImg, dogImg } = imageHub;
const GameDog = styled.div<{ roomState: string }>`
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
const GameAILevelText = styled.div`
  position: absolute;
  top: 350px;
  left: 75px;
  font-size: 26px;
`;
const { catAttackImg, catImg } = imageHub;
const GameCat = styled.div<{ roomState: string }>`
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
const GameDogEnergyInner = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: red;
`;

function AIGame() {
  // modal state
  const [displayExitModal, setDisplayExitModal] = useState(false);
  // game state
  const { isLogin, user } = useGlobalContext();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [AILevel, setAIlevel] = useState<number | typeof NaN>(NaN);
  const [roomState, setRoomState] = useState<string>('wait');
  const [windSpeedBar, setWindSpeedBar] = useState<number | undefined>(undefined); // -2 ~ 2
  const [isDisplayArrow, setIsDisplayArrow] = useState(true);
  // dog useState
  const [dogTurnTimeSpent, setDogTurnTimeSpent] = useState<number | undefined>(undefined);
  const [dogHitPoints, setDogHitPoints] = useState(100);
  const [dogHavePowerUp, setDogHavePowerUp] = useState(true);
  const [dogHaveDoubleHit, setDogHaveDoubleHit] = useState(true);
  const [dogHaveHeal, setDogHaveHeal] = useState(true);
  // cat useState
  const [catHitPoints, setCatHitPoints] = useState(100);
  // dog useRef
  const gameDogRef = useRef<HTMLDivElement>(null);
  const dogEnergyBarRef = useRef<HTMLDivElement>(null);
  const dogEnergyInnerRef = useRef<HTMLDivElement>(null);
  const gameDogPowerUpRef = useRef<HTMLDivElement>(null);
  const gameDogDoubleHitRef = useRef<HTMLDivElement>(null);
  const gameDogHealRef = useRef<HTMLDivElement>(null);
  // cat useRef
  const gameCatRef = useRef<HTMLDivElement>(null);

  const getAILevel = (level: number) => {
    setAIlevel(level);
    setRoomState('dogTurn');
  };
  const displayExitModalHandler = () => {
    setDisplayExitModal(false);
  };
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');

    function delay(sec: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, sec);
      });
    }

    // setDogTurn
    function setDogTurn() {
      let dogX = 840;
      let dogY = 540;
      let dogRadius = 20;
      let startTime: number;
      let timeHandler: NodeJS.Timeout;
      let startAnimation: NodeJS.Timeout;
      let dogEnergyInnerHandler: NodeJS.Timeout;
      let isMouseDown = false;
      let time = 1;
      let energy = 0;
      let hitPointsAvailable = 15;
      let windSpeed: number;

      function drawDog() {
        ctx?.beginPath();
        ctx?.arc(dogX, dogY, dogRadius, 0, Math.PI * 2, false);
        ctx?.fill();
        ctx?.closePath();
      }

      function windSpeedHandler() {
        const isPositive = Math.floor(Math.random() * 2);
        const randomNumber = Math.floor(Math.random() * 5);
        if (isPositive) {
          windSpeed = 0.5 * randomNumber;
          setWindSpeedBar(0.5 * randomNumber);
        } else {
          windSpeed = -0.5 * randomNumber;
          setWindSpeedBar(-0.5 * randomNumber);
        }
      }

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

      function stopAnimation() {
        clearInterval(timeHandler);
        clearInterval(startAnimation);
      }

      function testGameState() {
        const currentCatHitPoints = catHitPoints - hitPointsAvailable;
        if (currentCatHitPoints <= 0 && isLogin && user.uid && AILevel >= 0.9) {
          setRoomState('dogWin');
          firestore.achieveGoal2(user.uid);
        } else if (currentCatHitPoints <= 0) {
          setRoomState('dogWin');
        } else {
          setRoomState('catTurn');
        }
      }

      async function startAnimationHandler(quantityOfPower: number) {
        ctx?.clearRect(0, 0, 940, 560);
        drawDog();

        // up data dog coordinate
        dogX -= 10 + quantityOfPower - windSpeed * time;
        dogY -= 10 + quantityOfPower - time ** 2;

        // Is dog hit the cat?
        if (dogX >= 80 - dogRadius && dogX <= 130 + dogRadius && dogY >= 490 - dogRadius) {
          stopAnimation();
          setCatHitPoints((prev) => prev - hitPointsAvailable);
          ctx?.clearRect(0, 0, 940, 560);
          gameCatRef?.current?.setAttribute(
            'style',
            `background-image:url(${imageHub.catInjuriedImg})`,
          );
          await delay(1000);
          gameCatRef?.current?.setAttribute('style', '');
          testGameState();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
        } else if (
          (dogX >= 450 - dogRadius && dogX <= 490 + dogRadius && dogY >= 400 - dogRadius) ||
          dogY > 580 ||
          dogY < 0
        ) {
          stopAnimation();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
          ctx?.clearRect(0, 0, 940, 560);
          gameCatRef?.current?.setAttribute(
            'style',
            `background-image:url(${imageHub.catMissImg})`,
          );
          await delay(1000);
          gameCatRef?.current?.setAttribute('style', '');
          setRoomState('catTurn');
        }
      }
      function healHandler() {
        setDogHaveHeal(false);
        setDogHitPoints((prev) => (prev >= 80 ? 100 : prev + 20));
        removeAllListener();
        setRoomState('catTurn');
      }

      function doubleHitHandler() {
        setDogHaveDoubleHit(false);
        hitPointsAvailable = 30;
        gameDogHealRef.current?.removeEventListener('click', healHandler);
        gameDogPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
      }
      function PowerUpHandler() {
        setDogHavePowerUp(false);
        dogRadius = 40;
        gameDogDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
        gameDogHealRef.current?.removeEventListener('click', healHandler);
      }
      function mouseUpHandler() {
        if (isMouseDown) {
          const endTime = Number(new Date());
          const quantityOfPower = getQuantityOfPower(endTime);
          clearInterval(dogEnergyInnerHandler);
          timeHandler = setInterval(() => {
            time += 0.06;
          }, 10);
          startAnimation = setInterval(() => {
            startAnimationHandler(quantityOfPower);
          }, 15);
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
        setDogTurnTimeSpent(undefined);
      }
      let turnTimeSpent = 10;
      function startCountTimer() {
        turnTimeSpent -= 1;
        if (turnTimeSpent === 0) {
          setDogTurnTimeSpent(undefined);
          setRoomState('catTurn');
          removeAllListener();
          clearInterval(countTimer);
        } else if (turnTimeSpent <= 5) {
          setDogTurnTimeSpent(turnTimeSpent);
        }
      }
      const countTimer = setInterval(startCountTimer, 1000);
      windSpeedHandler();
      setIsDisplayArrow(true);
      gameDogHealRef.current?.addEventListener('click', healHandler);
      gameDogDoubleHitRef.current?.addEventListener('click', doubleHitHandler);
      gameDogPowerUpRef.current?.addEventListener('click', PowerUpHandler);
      gameDogRef.current?.addEventListener('mousedown', mouseDownHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }
    // setCatTurn
    function setCatTurn() {
      const AIData: { [key: string]: [number, number] } = {
        '-2': [9.1, 10],
        '-1.5': [7.6, 6.5],
        '-1': [6.1, 1.5],
        '-0.5': [4.9, 7],
        '-0': [3.8, 2],
        0: [3.8, 5.2],
        0.5: [2.7, 2],
        1: [2.7, 4],
        1.5: [2, 6.5],
        2: [1.7, 10],
      };
      let catX = 100;
      let catY = 540;
      let timeHandler: NodeJS.Timeout;
      let startAnimation: NodeJS.Timeout;
      let time = 1;
      let windSpeed: number; // -2 ~ 2

      function drawCat() {
        ctx?.beginPath();
        ctx?.arc(catX, catY, 20, 0, Math.PI * 2, false);
        ctx?.fill();
        ctx?.closePath();
      }
      function windSpeedHandler() {
        const isPositive = Math.floor(Math.random() * 2);
        const randomNumber = Math.floor(Math.random() * 5);
        if (isPositive) {
          windSpeed = 0.5 * randomNumber;
          setWindSpeedBar(0.5 * randomNumber);
        } else {
          windSpeed = -0.5 * randomNumber;
          setWindSpeedBar(-0.5 * randomNumber);
        }
      }
      function stopAnimation() {
        clearInterval(timeHandler);
        clearInterval(startAnimation);
      }

      function testGameState() {
        const currentDogHitPoints = dogHitPoints - 15;
        if (currentDogHitPoints <= 0) {
          setRoomState('catWin');
        } else {
          setRoomState('dogTurn');
        }
      }

      async function startAnimationHandler(quantityOfPower: number) {
        ctx?.clearRect(0, 0, 940, 560);
        drawCat();

        // up data cat coordinate
        catX += 10 + quantityOfPower + windSpeed * time;
        catY -= 10 + quantityOfPower - time ** 2;

        // Is dog hit the cat?
        if (catX >= 800 && catX <= 850 && catY >= 470) {
          stopAnimation();
          setDogHitPoints((prev) => prev - 15);
          ctx?.clearRect(0, 0, 940, 560);
          gameDogRef?.current?.setAttribute(
            'style',
            `background-image:url(${imageHub.dogInjuriedImg})`,
          );
          await delay(1000);
          gameDogRef?.current?.setAttribute('style', '');
          testGameState();
        } else if ((catX >= 430 && catX <= 510 && catY >= 380) || catY > 580 || catY < 0) {
          stopAnimation();
          ctx?.clearRect(0, 0, 940, 560);
          gameDogRef?.current?.setAttribute(
            'style',
            `background-image:url(${imageHub.dogMissImg})`,
          );
          await delay(1000);
          gameDogRef?.current?.setAttribute('style', '');
          setRoomState('dogTurn');
        }
      }

      function AIHitHandler(quantityOfPower: number) {
        timeHandler = setInterval(() => {
          time += 0.06;
        }, 10);
        startAnimation = setInterval(() => {
          startAnimationHandler(quantityOfPower);
        }, 15);
      }
      function AIActionHandler() {
        const randomData = Math.random();
        const windSpeedStr = windSpeed;
        if (randomData < (AILevel || NaN)) {
          AIHitHandler(AIData[windSpeedStr][0]);
        } else {
          AIHitHandler(AIData[windSpeedStr][1]);
        }
      }
      windSpeedHandler();
      setIsDisplayArrow(true);
      setTimeout(() => {
        setIsDisplayArrow(false);
        AIActionHandler();
      }, 2000);
    }
    ctx?.clearRect(0, 0, 940, 560);
    if (roomState === 'dogTurn') {
      setDogTurn();
    } else if (roomState === 'catTurn') {
      setCatTurn();
    }
  }, [roomState]);

  return (
    <GameBody>
      <GamePreloadBackgroundImg />
      <GameBack
        onClick={() => {
          setDisplayExitModal(true);
        }}
      />
      <GameScreen>
        {
          // prettier-ignore
          Number.isNaN(AILevel) ? ReactDOM.createPortal(
            <SelectLevelModel getAILevel={getAILevel} />,
            document?.getElementById('modal-root') as HTMLElement,
          ) : ''
        }
        {
          // prettier-ignore
          roomState === 'dogWin' || roomState === 'catWin' ? ReactDOM.createPortal(
            <GameoverModal roomState={roomState} title="Game Over!" />,
            document?.getElementById('modal-root') as HTMLElement,
          ) : ''
        }
        {
          // prettier-ignore
          displayExitModal ? ReactDOM.createPortal(
            <ExitModal displayExitModalHandler={displayExitModalHandler} />,
            document?.getElementById('modal-root') as HTMLElement,
          ) : ''
        }
        <GameCanvasSection>
          <GameControlPanel>
            <GameWindSpeedBox>
              <GameWindDirectionArrow windSpeed={windSpeedBar || 0} />
              <GameWindSpeedImg src={imageHub.windBarImg} />
              <GameWindSpeedBar>
                <GameWindSpeed windSpeed={windSpeedBar || 0} />
              </GameWindSpeedBar>
            </GameWindSpeedBox>
            <GameHitPointsImg src={imageHub.hitPointsBarImg} />
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
          </GameControlPanel>

          <GameCanvas width={940} height={560} ref={canvas} />
        </GameCanvasSection>
        <GameDogEnergyBar ref={dogEnergyBarRef}>
          <GameDogEnergyInner ref={dogEnergyInnerRef} />
        </GameDogEnergyBar>
        <GameDogTimer>{dogTurnTimeSpent}</GameDogTimer>
        <GameWhoseTurnMark roomState={roomState} isDisplayArrow={isDisplayArrow} />
        <GameDog ref={gameDogRef} roomState={roomState} />
        <GameAILevelText>{AILevel ? 'AI' : ''}</GameAILevelText>
        <GameCat ref={gameCatRef} roomState={roomState} />
      </GameScreen>
    </GameBody>
  );
}

export default AIGame;
