import React from 'react';
import styled from 'styled-components';
import dogImg from '../../img/gamepage/game_dog.png';
import dogInjuriedImg from '../../img/gamepage/game_dogInjuried.png';
import dogMissImg from '../../img/gamepage/game_dogMiss.png';
import catAttackImg from '../../img/gamepage/game_catAttack.png';
import catInjuriedImg from '../../img/gamepage/game_catInjuried.png';
import catMissImg from '../../img/gamepage/game_catMiss.png';

const PreloadBackgroundImg = styled.div`
  display: none;
`;
const Img = styled.img``;

function GamePreloadBackgroundImg() {
  return (
    <div>
      <PreloadBackgroundImg>
        <Img src={dogImg} />
        <Img src={dogInjuriedImg} />
        <Img src={dogMissImg} />
        <Img src={catInjuriedImg} />
        <Img src={catAttackImg} />
        <Img src={catMissImg} />
      </PreloadBackgroundImg>
    </div>
  );
}

export default GamePreloadBackgroundImg;
