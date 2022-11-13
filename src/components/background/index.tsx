import React from 'react';
import styled from 'styled-components';
import backgroundImg from '../../img/globalBackground.jpg';

const BackgroundImg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(${backgroundImg});
  opacity: 45%;
  z-index: -99;
`;
function Background() {
  return (
    <div>
      <BackgroundImg />
    </div>
  );
}

export default Background;
