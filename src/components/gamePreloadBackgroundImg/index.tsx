import React from 'react';
import styled from 'styled-components';
import imageHub from '../../utils/imageHub';

const PreloadImgs = styled.div`
  display: none;
`;
const Img = styled.img``;

function GamePreloadBackgroundImg() {
  return (
    <div>
      <PreloadImgs>
        <Img src={imageHub.dogImg} />
        <Img src={imageHub.dogInjuriedImg} />
        <Img src={imageHub.dogMissImg} />
        <Img src={imageHub.catInjuriedImg} />
        <Img src={imageHub.catAttackImg} />
        <Img src={imageHub.catMissImg} />
      </PreloadImgs>
    </div>
  );
}

export default GamePreloadBackgroundImg;
