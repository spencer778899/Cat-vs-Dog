import imageHub from '../../utils/imageHub';
import React from 'react';
import styled from 'styled-components';

const PreloadImgs = styled.div`
  display: none;
`;

function GamePreloadBackgroundImg() {
  return (
    <PreloadImgs>
      <img alt="preload" src={imageHub.dogImg} />
      <img alt="preload" src={imageHub.dogInjuriedImg} />
      <img alt="preload" src={imageHub.dogMissImg} />
      <img alt="preload" src={imageHub.catInjuriedImg} />
      <img alt="preload" src={imageHub.catAttackImg} />
      <img alt="preload" src={imageHub.catMissImg} />
    </PreloadImgs>
  );
}

export default GamePreloadBackgroundImg;
