/* eslint-disable no-use-before-define */
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { css, keyframes } from 'styled-components';
import GameoverModal from '../../components/gameoverModal';
import Arrow from '../../img/arrow.png';
import screenImg from '../../img/gamepage/game_screen.png';
import powerUpImg from '../../img/gamepage/game_powerUp.png';
import X2Img from '../../img/gamepage/game_X2.png';
import healImg from '../../img/gamepage/game_heal.png';
import hitPointsBarImg from '../../img/gamepage/game_hitPointsBar.png';
import windBarImg from '../../img/gamepage/game_windBar.png';
import dogImg from '../../img/gamepage/game_dog.png';
import dogAttackImg from '../../img/gamepage/game_dogAttack.png';
import catImg from '../../img/gamepage/game_cat.png';
import catAttackImg from '../../img/gamepage/game_catAttack.png';

const swing = keyframes`
  0%{background-position:center}
  50%{background-position:35%}
  100%{background-position:center}
`;
const swingAnimation = css`
  animation: ${swing} 1s linear infinite;
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
  background-color: ${({ windSpeed }) => (windSpeed > 0 ? 'blue' : 'red')};
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
const GameDogHitPointsInner = styled.div<{ width: number }>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(p) => `${p.width}%`};
  height: 100%;
  background-color: red;
  z-index: 9;
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
const GameDogPowerUp = styled.div<{ dogHavePowerUp: boolean }>`
  display: ${(p) => (p.dogHavePowerUp ? 'relative' : 'none')};
  width: 40px;
  height: 40px;
  background-image: url(${powerUpImg});
  background-size: cover;
  cursor: pointer;
`;
const GameDogDoubleHit = styled.div<{ dogHaveDoubleHit: boolean }>`
  display: ${(p) => (p.dogHaveDoubleHit ? 'relative' : 'none')};
  width: 40px;
  height: 40px;

  background-image: url(${X2Img});
  background-size: cover;
  cursor: pointer;
`;
const GameDogHeal = styled.div<{ dogHaveHeal: boolean }>`
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
const GameCatPowerUp = styled.div<{ catHavePowerUp: boolean }>`
  display: ${(p) => (p.catHavePowerUp ? 'relative' : 'none')};
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-image: url(${powerUpImg});
  background-size: cover;
  cursor: pointer;
`;
const GameCatDoubleHit = styled.div<{ catHaveDoubleHit: boolean }>`
  display: ${(p) => (p.catHaveDoubleHit ? 'relative' : 'none')};
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-image: url(${X2Img});
  background-size: cover;
  cursor: pointer;
`;
const GameCatHeal = styled.div<{ catHaveHeal: boolean }>`
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
const GameWhoseTurnMark = styled.div<{ roomState: string; isDisplayArrow: boolean }>`
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
const GameDog = styled.div<{ roomState: string }>`
  position: absolute;
  bottom: 0;
  right: 40px;
  width: 110px;
  height: 130px;
  background-image: url(${dogImg});
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
const GameCat = styled.div<{ roomState: string }>`
  position: absolute;
  bottom: 0;
  left: 40px;
  width: 110px;
  height: 130px;
  background-image: url(${catImg});
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

function Game() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [roomState, setRoomState] = useState('dogTurn');
  const [windSpeedBar, setWindSpeedBar] = useState<number | undefined>(undefined); // -2 ~ 2
  const [isDisplayArrow, setIsDisplayArrow] = useState(true);
  // dog useState
  const [dogTurnTimeSpent, setDogTurnTimeSpent] = useState<number | undefined>(undefined);
  const [dogHitPoints, setDogHitPoints] = useState(100);
  const [dogHavePowerUp, setDogHavePowerUp] = useState(true);
  const [dogHaveDoubleHit, setDogHaveDoubleHit] = useState(true);
  const [dogHaveHeal, setDogHaveHeal] = useState(true);
  // cat useState
  const [catTurnTimeSpent, setCatTurnTimeSpent] = useState<number | undefined>(undefined);
  const [catHitPoints, setCatHitPoints] = useState(100);
  const [catHavePowerUp, setCatHavePowerUp] = useState(true);
  const [catHaveDoubleHit, setCatHaveDoubleHit] = useState(true);
  const [catHaveHeal, setCatHaveHeal] = useState(true);
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
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');

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
      let windSpeed: number; // -2 ~ 2

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
        if (currentCatHitPoints <= 0) {
          setRoomState('dogWin');
        } else {
          setRoomState('catTurn');
        }
      }

      function startAnimationHandler(quantityOfPower: number) {
        ctx?.clearRect(0, 0, 940, 560);
        drawDog();

        // up data dog coordinate
        dogX -= 10 + quantityOfPower - windSpeed * time;
        dogY -= 10 + quantityOfPower - time ** 2;

        // Is dog hit the cat?
        if (dogX >= 80 - dogRadius && dogX <= 130 + dogRadius && dogY >= 490 - dogRadius) {
          console.log('hit!');
          stopAnimation();
          setCatHitPoints((prev) => prev - hitPointsAvailable);
          testGameState();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
        } else if (dogX >= 450 - dogRadius && dogX <= 490 + dogRadius && dogY >= 400 - dogRadius) {
          console.log('miss!');
          stopAnimation();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
          setRoomState('catTurn');
        } else if (dogY > 580 || dogY < 0) {
          console.log('miss!');
          stopAnimation();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
          setRoomState('catTurn');
        }
      }
      function healHandler() {
        setDogHaveHeal(false);
        setDogHitPoints((prev) => prev + 20);
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
          console.log(quantityOfPower);
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
      let catX = 100;
      let catY = 540;
      let catRadius = 20;
      let startTime: number;
      let timeHandler: NodeJS.Timeout;
      let startAnimation: NodeJS.Timeout;
      let CatEnergyInnerHandler: NodeJS.Timeout;
      let isMouseDown = false;
      let time = 1;
      let energy = 0;
      let hitPointsAvailable = 15;
      let windSpeed: number; // -2 ~ 2

      function drawCat() {
        ctx?.beginPath();
        ctx?.arc(catX, catY, catRadius, 0, Math.PI * 2, false);
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
          clearInterval(CatEnergyInnerHandler);
        }
        catEnergyInnerRef?.current?.setAttribute('style', `width:${energy}%`);
      }
      function mouseDownHandler() {
        isMouseDown = true;
        setIsDisplayArrow(false);
        clearInterval(countTimer);
        setCatTurnTimeSpent(undefined);
        catEnergyBarRef?.current?.setAttribute('style', 'display:block');
        CatEnergyInnerHandler = setInterval(increaseEnergy, 20);
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
        const currentDogHitPoints = dogHitPoints - hitPointsAvailable;
        if (currentDogHitPoints <= 0) {
          setRoomState('catWin');
        } else {
          setRoomState('dogTurn');
        }
      }

      function startAnimationHandler(quantityOfPower: number) {
        ctx?.clearRect(0, 0, 940, 560);
        drawCat();

        // up data cat coordinate
        catX += 10 + quantityOfPower + windSpeed * time;
        catY -= 10 + quantityOfPower - time ** 2;

        // Is dog cat the cat?
        if (catX >= 820 - catRadius && catX <= 870 + catRadius && catY >= 490 - catRadius) {
          console.log('hit!');
          stopAnimation();
          setDogHitPoints((prev) => prev - hitPointsAvailable);
          testGameState();
          catEnergyBarRef?.current?.setAttribute('style', 'display:none');
        } else if (catX >= 450 - catRadius && catX <= 490 + catRadius && catY >= 400 - catRadius) {
          console.log('miss!');
          stopAnimation();
          catEnergyBarRef?.current?.setAttribute('style', 'display:none');
          setRoomState('dogTurn');
        } else if (catY > 580 || catY < 0) {
          console.log('miss!');
          stopAnimation();
          catEnergyBarRef?.current?.setAttribute('style', 'display:none');
          setRoomState('dogTurn');
        }
      }
      function healHandler() {
        setCatHaveHeal(false);
        setCatHitPoints((prev) => prev + 20);
        removeAllListener();
        setRoomState('dogTurn');
      }

      function doubleHitHandler() {
        setCatHaveDoubleHit(false);
        hitPointsAvailable = 30;
        gameCatHealRef.current?.removeEventListener('click', healHandler);
        gameCatPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
      }
      function PowerUpHandler() {
        setCatHavePowerUp(false);
        catRadius = 40;
        gameCatDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
        gameCatHealRef.current?.removeEventListener('click', healHandler);
      }
      function mouseUpHandler() {
        if (isMouseDown) {
          const endTime = Number(new Date());
          const quantityOfPower = getQuantityOfPower(endTime);
          console.log(quantityOfPower);
          clearInterval(CatEnergyInnerHandler);
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
        gameCatHealRef.current?.removeEventListener('click', healHandler);
        gameCatDoubleHitRef.current?.removeEventListener('click', doubleHitHandler);
        gameCatPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
        gameCatRef.current?.removeEventListener('mousedown', mouseDownHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        clearInterval(countTimer);
        setCatTurnTimeSpent(undefined);
      }
      let turnTimeSpent = 10;
      function startCountTimer() {
        turnTimeSpent -= 1;
        if (turnTimeSpent === 0) {
          setCatTurnTimeSpent(undefined);
          setRoomState('dogTurn');
          removeAllListener();
          clearInterval(countTimer);
        } else if (turnTimeSpent <= 5) {
          setCatTurnTimeSpent(turnTimeSpent);
        }
      }
      const countTimer = setInterval(startCountTimer, 1000);
      windSpeedHandler();
      setIsDisplayArrow(true);
      gameCatHealRef.current?.addEventListener('click', healHandler);
      gameCatDoubleHitRef.current?.addEventListener('click', doubleHitHandler);
      gameCatPowerUpRef.current?.addEventListener('click', PowerUpHandler);
      gameCatRef.current?.addEventListener('mousedown', mouseDownHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }
    ctx?.clearRect(0, 0, 940, 560);
    if (roomState === 'dogTurn') {
      setDogTurn();
    } else if (roomState === 'catTurn') {
      setCatTurn();
    }
  }, [roomState]);

  return (
    <div>
      <GameScreen>
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
                <GameWindSpeed windSpeed={windSpeedBar || 0} />
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
    </div>
  );
}

export default Game;
