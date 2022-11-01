import React from 'react';
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
  return (
    <div>
      <GameScreen>
        <GameDogHitPoints>100</GameDogHitPoints>
        <GameCatHitPoints>100</GameCatHitPoints>
        <GameCanvasSection>
          <GameCanvas width={940} height={560} />
        </GameCanvasSection>
        <GameDog>dog</GameDog>
        <GameCat>cat</GameCat>
      </GameScreen>
    </div>
  );
}

export default Game;
