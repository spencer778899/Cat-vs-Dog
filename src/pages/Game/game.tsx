import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface GameDogHitPointsInnerProps {
  width: number;
}
interface GameWindSpeedProps {
  windSpeed: number;
}
interface GameDogPowerUpProps {
  havePowerUp: boolean;
}
interface GameDogDoubleHitProps {
  haveDoubleHit: boolean;
}
interface GameDogHealProps {
  haveHeal: boolean;
}

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
const GameWindSpeed = styled.div<GameWindSpeedProps>`
  position: absolute;
  right: ${(p) => (p.windSpeed > 0 ? 'none' : '50px')};
  left: ${(p) => (p.windSpeed > 0 ? '50px' : 'none')};
  top: 0;
  width: ${(p) => `${Math.abs(p.windSpeed) * 25}px`};
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
const GameDogPowerUp = styled.div<GameDogPowerUpProps>`
  display: ${(p) => (p.havePowerUp ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #000000;
  border-radius: 50%;
  cursor: pointer;
`;
const GameDogDoubleHit = styled.div<GameDogDoubleHitProps>`
  display: ${(p) => (p.haveDoubleHit ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid #000000;
  border-radius: 50%;
  cursor: pointer;
`;
const GameDogHeal = styled.div<GameDogHealProps>`
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
const GameDogHitPointsInner = styled.div<GameDogHitPointsInnerProps>`
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
const GameCatHitPointsInner = styled.div<GameDogHitPointsInnerProps>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(p) => `${p.width}%`};
  height: 100%;
  background-color: red;
`;

function Game() {
  const [dogHitPoints, setDogHitPoints] = useState(30);
  const [catHitPoints, setCatHitPoints] = useState(30);
  const [windSpeedBar, setWindSpeedBar] = useState<number | undefined>(undefined); // -2 ~ 2
  const [havePowerUp, setHavePowerUp] = useState(true);
  const [haveDoubleHit, setDoubleHit] = useState(true);
  const [haveHeal, setHaveHeal] = useState(true);
  const [roomState, setRoomState] = useState('dogTurn');
  const canvas = useRef<HTMLCanvasElement>(null);
  const GameDogRef = useRef<HTMLDivElement>(null);
  const dogEnergyBarRef = useRef<HTMLDivElement>(null);
  const dogEnergyInnerRef = useRef<HTMLDivElement>(null);
  const GameCatRef = useRef<HTMLDivElement>(null);
  const catEnergyBarRef = useRef<HTMLDivElement>(null);
  const catEnergyInnerRef = useRef<HTMLDivElement>(null);
  const windSpeedRef = useRef<HTMLDivElement>(null);
  const DogPowerUpRef = useRef<HTMLDivElement>(null);
  const DogDoubleHitRef = useRef<HTMLDivElement>(null);
  const GameDogHealRef = useRef<HTMLDivElement>(null);
  console.log(haveHeal);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    let catX = 840;
    let catY = 540;
    let dogX = 100;
    let dogY = 540;
    let windSpeed: number; // -2 ~ 2

    function drawWall() {
      ctx?.beginPath();
      ctx?.rect(450, 400, 40, 160);
      ctx?.fill();
      ctx?.closePath();
    }

    function drawDog() {
      ctx?.beginPath();
      ctx?.arc(dogX, dogY, 20, 0, Math.PI * 2, false);
      ctx?.fill();
      ctx?.closePath();
    }

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
    // setBegin
    function setGameBegin() {
      drawWall();
      drawDog();
      drawCat();
    }
    // setDogTurn
    function setDogTurn() {
      let startTime: number;
      let timeHandler: NodeJS.Timeout;
      let startAnimation: NodeJS.Timeout;
      let dogEnergyInnerHandler: NodeJS.Timeout;
      let isMouseDown = false;
      let time = 1;
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
        const currentCatHitPoints = catHitPoints - 15;
        if (currentCatHitPoints <= 0) {
          setRoomState('dogWin');
        } else {
          setRoomState('catTurn');
        }
      }

      function startAnimationHandler(quantityOfPower: number) {
        ctx?.clearRect(0, 0, 940, 560);

        // up data dog coordinate
        dogX += 10 + quantityOfPower + windSpeed * time;
        dogY -= 10 + quantityOfPower - time ** 2;

        // Is dog hit the cat?
        if (dogX >= 800 && dogX <= 890 && dogY >= 470 && dogY <= 560) {
          console.log('hit!');
          stopAnimation();
          setCatHitPoints((prev) => prev - 15);
          testGameState();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
        } else if (dogX >= 450 && dogX <= 490 && dogY >= 400 && dogY <= 560) {
          console.log('miss!');
          stopAnimation();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
          setRoomState('catTurn');
        } else if (dogX > 940 || dogX <= 0 || dogY > 560 || dogY < 0) {
          console.log('miss!');
          stopAnimation();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
          setRoomState('catTurn');
        }
        drawDog();
        drawWall();
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
          GameDogRef.current?.removeEventListener('mousedown', mouseDownHandler);
          window.removeEventListener('mouseup', mouseUpHandler);
        }
      }
      function PowerUpHandler() {
        setHaveHeal(false);
        setDogHitPoints((prev) => prev + 20);
        GameDogRef.current?.removeEventListener('mousedown', mouseDownHandler);
        GameDogHealRef.current?.removeEventListener('click', PowerUpHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        setRoomState('catTurn');
      }
      windSpeedRef.current?.setAttribute('value', `${windSpeed}`);
      GameDogRef.current?.addEventListener('mousedown', mouseDownHandler);
      GameDogHealRef.current?.addEventListener('click', PowerUpHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }
    // setCatTurn
    function setCatTurn() {
      let startTime: number;
      let timeHandler: NodeJS.Timeout;
      let startAnimation: NodeJS.Timeout;
      let CatEnergyInnerHandler: NodeJS.Timeout;
      let isMouseDown = false;
      let time = 1;
      let energy = 0;
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
        drawWall();
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
          GameCatRef.current?.removeEventListener('mousedown', mouseDownHandler);
          window.removeEventListener('mouseup', mouseUpHandler);
        }
      }
      windSpeedRef.current?.setAttribute('value', `${windSpeed}`);
      GameCatRef.current?.addEventListener('mousedown', mouseDownHandler);
      window.addEventListener('mouseup', mouseUpHandler);
    }
    ctx?.clearRect(0, 0, 940, 560);
    setGameBegin();
    if (roomState === 'dogTurn') {
      windSpeedHandler();
      setDogTurn();
    } else if (roomState === 'catTurn') {
      windSpeedHandler();
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
            <GameDogPowerUp havePowerUp={havePowerUp}>⚡</GameDogPowerUp>
            <GameDogDoubleHit haveDoubleHit={haveDoubleHit}>X2</GameDogDoubleHit>
            <GameDogHeal ref={GameDogHealRef} haveHeal={haveHeal}>
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
        <GameDog ref={GameDogRef}>dog</GameDog>
        <GameCat ref={GameCatRef}>cat</GameCat>
      </GameScreen>
    </div>
  );
}

export default Game;
