/* eslint-disable no-use-before-define */
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

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
const GameDogPowerUp = styled.div<{ havePowerUp: boolean }>`
  display: ${(p) => (p.havePowerUp ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #000000;
  border-radius: 50%;
  cursor: pointer;
`;
const GameDogDoubleHit = styled.div<{ haveDoubleHit: boolean }>`
  display: ${(p) => (p.haveDoubleHit ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #000000;
  border-radius: 50%;
  cursor: pointer;
`;
const GameDogHeal = styled.div<{ haveHeal: boolean }>`
  display: ${(p) => (p.haveHeal ? 'flex' : 'none')};
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
const GameDogHitPointsInner = styled.div<{ width: number }>`
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
const GameCatHitPointsInner = styled.div<{ width: number }>`
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
  border: 1px solid #000000;
`;

function Game() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [roomState, setRoomState] = useState('dogTurn');
  const [dogHitPoints, setDogHitPoints] = useState(40);
  const [catHitPoints, setCatHitPoints] = useState(40);
  const [windSpeedBar, setWindSpeedBar] = useState<number | undefined>(undefined); // -2 ~ 2
  const [havePowerUp, setHavePowerUp] = useState(true);
  const [haveDoubleHit, setHaveDoubleHit] = useState(true);
  const [haveHeal, setHaveHeal] = useState(true);
  const gameDogRef = useRef<HTMLDivElement>(null);
  const dogEnergyBarRef = useRef<HTMLDivElement>(null);
  const dogEnergyInnerRef = useRef<HTMLDivElement>(null);
  const gameCatRef = useRef<HTMLDivElement>(null);
  const catEnergyBarRef = useRef<HTMLDivElement>(null);
  const catEnergyInnerRef = useRef<HTMLDivElement>(null);
  const gameDogPowerUpRef = useRef<HTMLDivElement>(null);
  const gameDogDoubleHitRef = useRef<HTMLDivElement>(null);
  const gameDogHealRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    // setDogTurn
    function setDogTurn() {
      let dogX = 100;
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
        dogX += 10 + quantityOfPower + windSpeed * time;
        dogY -= 10 + quantityOfPower - time ** 2;

        // Is dog hit the cat?
        if (dogX >= 820 - dogRadius && dogX <= 870 + dogRadius && dogY >= 490 - dogRadius) {
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
        setHaveHeal(false);
        setDogHitPoints((prev) => prev + 20);
        removeAllListener();
        setRoomState('catTurn');
      }

      function doubleHitHandler() {
        setHaveDoubleHit(false);
        hitPointsAvailable = 30;
        gameDogHealRef.current?.removeEventListener('click', healHandler);
        gameDogPowerUpRef.current?.removeEventListener('click', PowerUpHandler);
      }
      function PowerUpHandler() {
        setHavePowerUp(false);
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
      }
      windSpeedHandler();
      gameDogHealRef.current?.addEventListener('click', healHandler);
      gameDogDoubleHitRef.current?.addEventListener('click', doubleHitHandler);
      gameDogPowerUpRef.current?.addEventListener('click', PowerUpHandler);
      gameDogRef.current?.addEventListener('mousedown', mouseDownHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }
    // setCatTurn
    function setCatTurn() {
      let catX = 840;
      let catY = 540;
      let startTime: number;
      let timeHandler: NodeJS.Timeout;
      let startAnimation: NodeJS.Timeout;
      let CatEnergyInnerHandler: NodeJS.Timeout;
      let isMouseDown = false;
      let time = 1;
      let energy = 0;
      function drawCat() {
        ctx?.beginPath();
        ctx?.arc(catX, catY, 20, 0, Math.PI * 2, false);
        ctx?.fill();
        ctx?.closePath();
      }
      let windSpeed: number; // -2 ~ 2
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
        const currentDogHitPoints = dogHitPoints - 15;
        if (currentDogHitPoints <= 0) {
          setRoomState('catWin');
        } else {
          setRoomState('dogTurn');
        }
      }

      function startAnimationHandler(quantityOfPower: number) {
        ctx?.clearRect(0, 0, 940, 560);

        // up data cat coordinate
        catX -= 10 + quantityOfPower - windSpeed * time;
        catY -= 10 + quantityOfPower - time ** 2;

        // Is dog cat the cat?
        if (catX >= 60 && catX <= 150 && catY >= 470 && catY <= 560) {
          console.log('hit!');
          stopAnimation();
          setDogHitPoints((prev) => prev - 15);
          testGameState();
          catEnergyBarRef?.current?.setAttribute('style', 'display:none');
        } else if (catX >= 450 && catX <= 490 && catY >= 400 && catY <= 560) {
          console.log('miss!');
          stopAnimation();
          catEnergyBarRef?.current?.setAttribute('style', 'display:none');
          setRoomState('dogTurn');
        } else if (catX > 940 || catX <= 0 || catY > 560 || catY < 0) {
          console.log('miss!');
          stopAnimation();
          catEnergyBarRef?.current?.setAttribute('style', 'display:none');
          setRoomState('dogTurn');
        }
        drawCat();
        // drawWall();
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
          gameCatRef.current?.removeEventListener('mousedown', mouseDownHandler);
          window.removeEventListener('mouseup', mouseUpHandler);
        }
      }
      windSpeedHandler();
      gameCatRef.current?.addEventListener('mousedown', mouseDownHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }
    ctx?.clearRect(0, 0, 940, 560);
    if (roomState === 'dogTurn') {
      setDogTurn();
    } else if (roomState === 'catTurn') {
      setCatTurn();
    } else if (roomState === 'dogWin' || roomState === 'catWin') {
      alert(roomState);
    }
  }, [roomState]);

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
            <GameDogPowerUp ref={gameDogPowerUpRef} havePowerUp={havePowerUp}>
              ⚡
            </GameDogPowerUp>
            <GameDogDoubleHit ref={gameDogDoubleHitRef} haveDoubleHit={haveDoubleHit}>
              X2
            </GameDogDoubleHit>
            <GameDogHeal ref={gameDogHealRef} haveHeal={haveHeal}>
              ✚
            </GameDogHeal>
          </GameDogSkillBox>
          <GameCatHitPointsBar>
            <GameCatHitPointsInner width={catHitPoints} />
          </GameCatHitPointsBar>
          <GameCanvas width={940} height={560} ref={canvas} />
        </GameCanvasSection>
        <GameDogEnergyBar ref={dogEnergyBarRef}>
          <GameDogEnergyInner ref={dogEnergyInnerRef} />
        </GameDogEnergyBar>
        <GameCatEnergyBar ref={catEnergyBarRef}>
          <GameCatEnergyInner ref={catEnergyInnerRef} />
        </GameCatEnergyBar>
        <GameDog ref={gameDogRef}>dog</GameDog>
        <GameCat ref={gameCatRef}>cat</GameCat>
        <GameWall>我是div，不是canvas</GameWall>
      </GameScreen>
    </div>
  );
}

export default Game;
