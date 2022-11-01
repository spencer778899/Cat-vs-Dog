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
const GameDogEnergyInner = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: red;
`;

function Game() {
  const [dogHitPoints, setDogHitPoints] = useState(100);
  const [turnOwner, setturnOwner] = useState<string | undefined>('dog');
  const canvas = useRef<HTMLCanvasElement>(null);
  const dogDIV = useRef<HTMLDivElement>(null);
  const dogEnergyBar = useRef<HTMLDivElement>(null);
  const dogEnergyinner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    const catX = 840;
    const catY = 540;
    let dogX = 100;
    let dogY = 540;
    const dogDOM = dogDIV.current;
    let startTime: number;
    let timeHandler: NodeJS.Timeout;
    let startAnimation: NodeJS.Timeout;
    let time = 1;
    let dogEnergyinnerHandler: NodeJS.Timeout;
    let energy = 0;

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
    function increaseEnergy() {
      energy += 1;
      if (energy >= 100) {
        clearInterval(dogEnergyinnerHandler);
      }
      dogEnergyinner?.current?.setAttribute('style', `width:${energy}%`);
    }

    function setHostRound() {
      function mouseDownHandler() {
        dogEnergyBar?.current?.setAttribute('style', 'display:block');
        dogEnergyinnerHandler = setInterval(increaseEnergy, 20);
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
          dogEnergyBar?.current?.setAttribute('style', 'display:none');
        } else if (dogX > 940 || dogX <= 0 || dogY > 560 || dogY < 0) {
          console.log('miss!');
          stopAnimation();
          setDogHitPoints((prev) => prev);
          dogEnergyBar?.current?.setAttribute('style', 'display:none');
        }
        drawDog();
        drawWall();
      }

      function mouseUpHandler() {
        const endTime = Number(new Date());
        const quantityOfPower = getQuantityOfPower(endTime);
        console.log(quantityOfPower);
        clearInterval(dogEnergyinnerHandler);
        timeHandler = setInterval(() => {
          time += 0.06;
        }, 10);
        startAnimation = setInterval(() => {
          startAnimationHandler(quantityOfPower);
        }, 15);
        dogDOM?.removeEventListener('mousedown', mouseDownHandler);
        dogDOM?.removeEventListener('mouseup', mouseUpHandler);
      }
      dogDOM?.addEventListener('mousedown', mouseDownHandler);
      dogDOM?.addEventListener('mouseup', mouseUpHandler);
    }
    console.log('effect');
    ctx?.clearRect(0, 0, 940, 560);
    drawWall();
    drawDog();
    drawCat();
    setHostRound();
  }, [dogHitPoints]);

  return (
    <div>
      <GameScreen>
        <GameDogHitPoints>{dogHitPoints}</GameDogHitPoints>
        <GameCatHitPoints>100</GameCatHitPoints>
        <GameCanvasSection>
          <GameCanvas width={940} height={560} ref={canvas} />
        </GameCanvasSection>
        <GameDogEnergyBar ref={dogEnergyBar}>
          <GameDogEnergyInner ref={dogEnergyinner} />
        </GameDogEnergyBar>
        {/* <GameCatEnergyBar>
          <GameCatEnergyInner />
        </GameCatEnergyBar> */}
        <GameDog ref={dogDIV}>dog</GameDog>
        <GameCat>cat</GameCat>
      </GameScreen>
    </div>
  );
}

export default Game;
