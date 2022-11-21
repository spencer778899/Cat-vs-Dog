import React from 'react';
import styled from 'styled-components';
import puppy1Img from '../../img/puppy1.png';
import puppy2Img from '../../img/puppy2.png';
import puppy3Img from '../../img/puppy3.png';
import puppy4Img from '../../img/puppy4.png';
import puppy5Img from '../../img/puppy5.png';

const PreloadBackgroundImg = styled.div`
  display: none;
`;
const PreloadBackgroundImg1 = styled.img``;
const PreloadBackgroundImg2 = styled.img``;
const PreloadBackgroundImg3 = styled.img``;
const PreloadBackgroundImg4 = styled.img``;
const PreloadBackgroundImg5 = styled.img``;

function SelectLevelModalPreload() {
  return (
    <div>
      <PreloadBackgroundImg>
        <PreloadBackgroundImg1 src={puppy1Img} />
        <PreloadBackgroundImg2 src={puppy2Img} />
        <PreloadBackgroundImg3 src={puppy3Img} />
        <PreloadBackgroundImg4 src={puppy4Img} />
        <PreloadBackgroundImg5 src={puppy5Img} />
      </PreloadBackgroundImg>
    </div>
  );
}

export default SelectLevelModalPreload;
