import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import YellowButton from '../buttons/yellowButton';
import catWin1Img from '../../img/gamepage/game_catWin1.png';
import catWin2Img from '../../img/gamepage/game_catWin2.png';
import dogWin1Img from '../../img/gamepage/game_dogWin1.png';
import dogWin2Img from '../../img/gamepage/game_dogWin2.png';

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
  width: 380px;
  height: 380px;
  margin: auto;
  padding: 20px 20px 20px 20px;
  border: 1px solid #000000;
  border-radius: 20px;
  background-color: #ffffff;
  z-index: 99;
`;
const GameoverModalDogAnimation = styled.div`
  width: 200px;
  height: 200px;
  background-image: url(${dogWin1Img});
  background-size: cover;
  animation-duration: 1s;
  animation-name: dogAnimation;
  animation-iteration-count: infinite;
  @keyframes dogAnimation {
    0% {
      background-image: url(${dogWin1Img});
    }
    50% {
      background-image: url(${dogWin1Img});
    }
    51% {
      background-image: url(${dogWin2Img});
    }
    100% {
      background-image: url(${dogWin2Img});
    }
  }
`;
const GameoverModalCatAnimation = styled.div`
  width: 160px;
  height: 200px;
  background-image: url(${catWin1Img});
  background-size: cover;
  animation-duration: 1s;
  animation-name: catAnimation;
  animation-iteration-count: infinite;
  @keyframes catAnimation {
    0% {
      background-image: url(${catWin1Img});
    }
    50% {
      background-image: url(${catWin1Img});
    }
    51% {
      background-image: url(${catWin2Img});
    }
    100% {
      background-image: url(${catWin2Img});
    }
  }
`;
const GameoverModalText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 48px;
  margin: 20px;
`;
const GameoverModalButtonBox = styled.div``;

function GameoverModal({ roomState }: GameProps) {
  const navigate = useNavigate();

  return (
    <div>
      <GameoverModalBody>
        <GameoverModalMain>
          {roomState === 'dogWin' ? <GameoverModalDogAnimation /> : ''}
          {roomState === 'catWin' ? <GameoverModalCatAnimation /> : ''}
          <GameoverModalText>{roomState === 'dogWin' ? 'Dog Win!' : 'Cat Win!'}</GameoverModalText>
          <GameoverModalButtonBox>
            <YellowButton
              content="返回"
              loading={false}
              onClick={() => {
                navigate('/');
              }}
            />
          </GameoverModalButtonBox>
        </GameoverModalMain>
      </GameoverModalBody>
    </div>
  );
}

export default GameoverModal;
