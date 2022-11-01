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
const GameDogHitPoints = styled.div`
  width: 50%;
  margin-top: 20px;
  text-align: center;
  font-size: 24px;
`;
const GameCatHitPoints = styled.div`
  width: 50%;
  margin-top: 20px;
  text-align: center;
  font-size: 24px;
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
  top: 536px;
  left: 80px;
  width: 50px;
  height: 70px;
  color: #ffffff;
  background-color: cornflowerblue;
`;
const GameCat = styled.div`
  position: absolute;
  top: 536px;
  left: 820px;
  width: 50px;
  height: 70px;
  color: #ffffff;
  background-color: cornflowerblue;
`;
const GameDogEnergyBar = styled.div`
  display: none;
  position: absolute;
  left: 55px;
  top: 480px;
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
  top: 480px;
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
  const [dogHitPoints, setDogHitPoints] = useState(100);
  const [catHitPoints, setCatHitPoints] = useState(100);
  const [turnOwner, setTurnOwner] = useState<string | undefined>('dog');
  const canvas = useRef<HTMLCanvasElement>(null);
  const GameDogRef = useRef<HTMLDivElement>(null);
  const dogEnergyBarRef = useRef<HTMLDivElement>(null);
  const dogEnergyInnerRef = useRef<HTMLDivElement>(null);
  const GameCatRef = useRef<HTMLDivElement>(null);
  const catEnergyBarRef = useRef<HTMLDivElement>(null);
  const catEnergyInnerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    let catX = 840;
    let catY = 540;
    let dogX = 100;
    let dogY = 540;

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
    // setDogTurn
    function setDogTurn() {
      let startTime: number;
      let timeHandler: NodeJS.Timeout;
      let startAnimation: NodeJS.Timeout;
      let time = 1;
      let dogEnergyInnerHandler: NodeJS.Timeout;
      let energy = 0;
      function increaseEnergy() {
        energy += 1;
        if (energy >= 100) {
          clearInterval(dogEnergyInnerHandler);
        }
        dogEnergyInnerRef?.current?.setAttribute('style', `width:${energy}%`);
      }
      function mouseDownHandler() {
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

      function startAnimationHandler(quantityOfPower: number) {
        ctx?.clearRect(0, 0, 940, 560);

        // up data dog coordinate
        dogX += 10 + quantityOfPower - 0 * time;
        dogY -= 10 + quantityOfPower - time ** 2;

        // Is dog hit the cat?
        if (dogX >= 800 && dogX <= 890 && dogY >= 470 && dogY <= 560) {
          console.log('hit!');
          stopAnimation();
          setDogHitPoints((prev) => prev - 15);
          setTurnOwner('cat');
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
        } else if (dogX > 940 || dogX <= 0 || dogY > 560 || dogY < 0) {
          console.log('miss!');
          stopAnimation();
          dogEnergyBarRef?.current?.setAttribute('style', 'display:none');
          setTurnOwner('cat');
        }
        drawDog();
        drawWall();
      }

      function mouseUpHandler() {
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
        GameDogRef.current?.removeEventListener('mouseup', mouseUpHandler);
      }
      GameDogRef.current?.addEventListener('mousedown', mouseDownHandler);
      GameDogRef.current?.addEventListener('mouseup', mouseUpHandler);
    }
    // setCatTurn
    function setCatTurn() {
      let startTime: number;
      let timeHandler: NodeJS.Timeout;
      let startAnimation: NodeJS.Timeout;
      let time = 1;
      let CatEnergyInnerHandler: NodeJS.Timeout;
      let energy = 0;
      function increaseEnergy() {
        energy += 1;
        if (energy >= 100) {
          clearInterval(CatEnergyInnerHandler);
        }
        catEnergyInnerRef?.current?.setAttribute('style', `width:${energy}%`);
      }
      function mouseDownHandler() {
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

      function startAnimationHandler(quantityOfPower: number) {
        ctx?.clearRect(0, 0, 940, 560);

        // up data cat coordinate
        catX -= 10 + quantityOfPower - 0 * time;
        catY -= 10 + quantityOfPower - time ** 2;

        // Is dog cat the cat?
        if (catX >= 60 && catX <= 150 && catY >= 470 && catY <= 560) {
          console.log('hit!');
          stopAnimation();
          setCatHitPoints((prev) => prev - 15);
          setTurnOwner('dog');
          catEnergyBarRef?.current?.setAttribute('style', 'display:none');
        } else if (catX > 940 || catX <= 0 || catY > 560 || catY < 0) {
          console.log('miss!');
          stopAnimation();
          catEnergyBarRef?.current?.setAttribute('style', 'display:none');
          setTurnOwner('dog');
        }
        drawCat();
        drawWall();
      }

      function mouseUpHandler() {
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
        GameCatRef.current?.removeEventListener('mouseup', mouseUpHandler);
      }
      GameCatRef.current?.addEventListener('mousedown', mouseDownHandler);
      GameCatRef.current?.addEventListener('mouseup', mouseUpHandler);
    }
    ctx?.clearRect(0, 0, 940, 560);
    drawWall();
    drawDog();
    drawCat();
    if (turnOwner === 'dog') {
      setDogTurn();
    } else if (turnOwner === 'cat') {
      setCatTurn();
    }
  }, [turnOwner]);

  return (
    <div>
      <GameScreen>
        <GameDogHitPoints>{dogHitPoints}</GameDogHitPoints>
        <GameCatHitPoints>{catHitPoints}</GameCatHitPoints>
        <GameCanvasSection>
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
