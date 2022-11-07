import React from 'react';
import styled from 'styled-components';

const WaitOpponentModalBody = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 98;
`;
const WaitOpponentModalMain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 400px;
  height: 400px;
  margin: auto;
  z-index: 99;
  background-color: #ffffff;
`;

function WaitOpponentModal() {
  return (
    <div>
      <WaitOpponentModalBody>
        <WaitOpponentModalMain>Wait your opponent...</WaitOpponentModalMain>
      </WaitOpponentModalBody>
    </div>
  );
}

export default WaitOpponentModal;
