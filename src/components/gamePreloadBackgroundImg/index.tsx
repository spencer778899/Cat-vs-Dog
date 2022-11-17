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
const PreloadBackgroundImg1 = styled.img``;
const PreloadBackgroundImg2 = styled.img``;
const PreloadBackgroundImg3 = styled.img``;
const PreloadBackgroundImg4 = styled.img``;
const PreloadBackgroundImg5 = styled.img``;
const PreloadBackgroundImg6 = styled.img``;

function GamePreloadBackgroundImg() {
  return (
    <div>
      <PreloadBackgroundImg>
        <PreloadBackgroundImg1 src={dogImg} />
        <PreloadBackgroundImg2 src={dogInjuriedImg} />
        <PreloadBackgroundImg3 src={dogMissImg} />
        <PreloadBackgroundImg4 src={catInjuriedImg} />
        <PreloadBackgroundImg5 src={catAttackImg} />
        <PreloadBackgroundImg6 src={catMissImg} />
      </PreloadBackgroundImg>
    </div>
  );
}

export default GamePreloadBackgroundImg;
