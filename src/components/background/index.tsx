import backgroundImg from '../../img/globalBackground.jpg';
import React from 'react';
import styled from 'styled-components';

const BackgroundImg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(${backgroundImg});
  filter: blur(1px) brightness(0.7);
  opacity: 45%;
  z-index: -99;
`;
function Background({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <BackgroundImg />
      {children}
    </div>
  );
}

export default Background;
