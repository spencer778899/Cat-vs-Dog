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
  top: 566px;
  left: 80px;
  width: 40px;
  height: 40px;
  color: #ffffff;
  background-color: cornflowerblue;
`;
const GameCat = styled.div`
  position: absolute;
  top: 566px;
  left: 820px;
  width: 40px;
  height: 40px;
  color: #ffffff;
  background-color: cornflowerblue;
`;

function Game() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const dogDIV = useRef<HTMLDivElement>(null);
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

    function setHostRound() {
      function getStartTime() {
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
        if (dogX >= 800 && dogX <= 880 && dogY >= 520 && dogY <= 580) {
          console.log('hit!');
          stopAnimation();
        } else if (dogX > 940 || dogX <= 0 || dogY > 560 || dogY < 0) {
          console.log('miss!');
          stopAnimation();
        }
        drawDog();
        drawWall();
      }

      function mouseUpHandler() {
        const endTime = Number(new Date());
        const quantityOfPower = getQuantityOfPower(endTime);
        console.log(quantityOfPower);
        timeHandler = setInterval(() => {
          time += 0.06;
        }, 10);
        startAnimation = setInterval(() => {
          startAnimationHandler(quantityOfPower);
        }, 15);
        dogDOM?.removeEventListener('mousedown', getStartTime);
        dogDOM?.removeEventListener('mouseup', mouseUpHandler);
      }
      dogDOM?.addEventListener('mousedown', getStartTime);
      dogDOM?.addEventListener('mouseup', mouseUpHandler);
    }
    drawWall();
    drawDog();
    drawCat();
    setHostRound();
  }, []);

  return (
    <div>
      <GameScreen>
        <GameDogHitPoints>100</GameDogHitPoints>
        <GameCatHitPoints>100</GameCatHitPoints>
        <GameCanvasSection>
          <GameCanvas width={940} height={560} ref={canvas} />
        </GameCanvasSection>
        <GameDog ref={dogDIV}>dog</GameDog>
        <GameCat>cat</GameCat>
      </GameScreen>
    </div>
  );
}

export default Game;
