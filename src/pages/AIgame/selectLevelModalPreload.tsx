import React from 'react';
import styled from 'styled-components';
import puppy1Img from '../../img/puppy1.png';
import puppy2Img from '../../img/puppy2.png';
import puppy3Img from '../../img/puppy3.png';
import puppy4Img from '../../img/puppy4.png';
import puppy5Img from '../../img/puppy5.png';
import github1Img from '../../img/github1.png';
import github2Img from '../../img/github2.png';
import hacker1Img from '../../img/hacker1.png';
import hacker2Img from '../../img/hacker2.png';

const PreloadBackgroundImg = styled.div`
  display: none;
`;
const Img = styled.img``;

function SelectLevelModalPreload() {
  return (
    <div>
      <PreloadBackgroundImg>
        <Img src={puppy1Img} />
        <Img src={puppy2Img} />
        <Img src={puppy3Img} />
        <Img src={puppy4Img} />
        <Img src={puppy5Img} />
        <Img src={github1Img} />
        <Img src={github2Img} />
        <Img src={hacker1Img} />
        <Img src={hacker2Img} />
      </PreloadBackgroundImg>
    </div>
  );
}

export default SelectLevelModalPreload;
