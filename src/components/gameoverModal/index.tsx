import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface GameProps {
  roomState: string;
}

const GameoverModalBody = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 22, 46, 0.68);
  z-index: 98;
`;
const GameoverModalMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 480px;
  height: 480px;
  margin: auto;
  padding: 50px 20px 20px 20px;
  border: 1px solid #000000;
  border-radius: 20px;
  background-color: #ffffff;
  z-index: 99;
`;
const GameoverModalText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 440px;
  font-size: 48px;
`;
const GameoverModalBack = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 186px;
  height: 40px;
  margin-bottom: -40px;
  border: 5px solid #000000;
  border-radius: 24px;
  background-color: #ffbf00;
  color: #000000;
  text-decoration: none;
  cursor: pointer; ;
`;

function GameoverModal({ roomState }: GameProps) {
  return (
    <div>
      <GameoverModalBody>
        <GameoverModalMain>
          <GameoverModalText>{roomState}</GameoverModalText>
          <GameoverModalBack to="/">返回</GameoverModalBack>
        </GameoverModalMain>
      </GameoverModalBody>
    </div>
  );
}

export default GameoverModal;
