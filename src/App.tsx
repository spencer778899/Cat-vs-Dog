import React from 'react';
import { Outlet } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import img from './img/globalBackground.jpg';

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;
const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(${img});
  opacity: 45%;
  z-index: -99;
`;
function App() {
  return (
    <>
      <GlobalStyle />
      <Background />
      <Outlet />
    </>
  );
}

export default App;
