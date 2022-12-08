import React from 'react';
import styled from 'styled-components';
import imageHub from '../../utils/imageHub';

const PreloadImgs = styled.div`
  display: none;
`;
const Img = styled.img``;

function SelectLevelModalPreload() {
  return (
    <div>
      <PreloadImgs>
        <Img src={imageHub.puppy1Img} />
        <Img src={imageHub.puppy2Img} />
        <Img src={imageHub.puppy3Img} />
        <Img src={imageHub.puppy4Img} />
        <Img src={imageHub.puppy5Img} />
        <Img src={imageHub.github1Img} />
        <Img src={imageHub.github2Img} />
        <Img src={imageHub.hacker1Img} />
        <Img src={imageHub.hacker2Img} />
      </PreloadImgs>
    </div>
  );
}

export default SelectLevelModalPreload;
