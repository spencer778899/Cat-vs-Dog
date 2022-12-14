import YellowButton from '../buttons/yellowButton';
import imageHub from '../../utils/imageHub';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
const GameoverModalTitle = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  width: 360px;
  height: 84px;
  margin: -50px auto auto auto;
  background-image: url(${imageHub.titleImg});
  background-size: cover;
  background-position: center;
`;
const GameoverModalTitleText = styled.div`
  margin-top: 7px;
  font-size: 26px;
  line-height: 2;
  color: #ffbf00;
  text-shadow: 0 -1px 0 #fffa6d, #001b51 3px 0 0, #001b51 2.83487px 0.981584px 0,
    #001b51 2.35766px 1.85511px 0, #001b51 1.62091px 2.52441px 0, #001b51 0.705713px 2.91581px 0,
    #001b51 -0.287171px 2.98622px 0, #001b51 -1.24844px 2.72789px 0, #001b51 -2.07227px 2.16926px 0,
    #001b51 -2.66798px 1.37182px 0, #001b51 -2.96998px 0.42336px 0, #001b51 -2.94502px -0.571704px 0,
    #001b51 -2.59586px -1.50383px 0, #001b51 -1.96093px -2.27041px 0,
    #001b51 -1.11013px -2.78704px 0, #001b51 -0.137119px -2.99686px 0,
    #001b51 0.850987px -2.87677px 0, #001b51 1.74541px -2.43999px 0, #001b51 2.44769px -1.73459px 0,
    #001b51 2.88051px -0.838247px 0;
`;
const GameoverModalDogAnimation = styled.div`
  width: 200px;
  height: 200px;
  background-image: url(${imageHub.dogWin1Img});
  background-size: cover;
  animation-duration: 1s;
  animation-name: dogAnimation;
  animation-iteration-count: infinite;
  @keyframes dogAnimation {
    0% {
      background-image: url(${imageHub.dogWin1Img});
    }
    50% {
      background-image: url(${imageHub.dogWin1Img});
    }
    51% {
      background-image: url(${imageHub.dogWin2Img});
    }
    100% {
      background-image: url(${imageHub.dogWin2Img});
    }
  }
`;
const GameoverModalCatAnimation = styled.div`
  width: 160px;
  height: 200px;
  background-image: url(${imageHub.catWin1Img});
  background-size: cover;
  animation-duration: 1s;
  animation-name: catAnimation;
  animation-iteration-count: infinite;
  @keyframes catAnimation {
    0% {
      background-image: url(${imageHub.catWin1Img});
    }
    50% {
      background-image: url(${imageHub.catWin1Img});
    }
    51% {
      background-image: url(${imageHub.catWin2Img});
    }
    100% {
      background-image: url(${imageHub.catWin2Img});
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

function GameoverModal({ roomState, title }: { roomState: string; title: string }) {
  const navigate = useNavigate();

  return (
    <div>
      <GameoverModalBody>
        <GameoverModalMain>
          <GameoverModalTitle>
            <GameoverModalTitleText>{title}</GameoverModalTitleText>
          </GameoverModalTitle>
          {roomState === 'dogWin' && <GameoverModalDogAnimation />}
          {roomState === 'catWin' && <GameoverModalCatAnimation />}
          <GameoverModalText>{roomState === 'dogWin' ? 'Dog Win!' : 'Cat Win!'}</GameoverModalText>
          <GameoverModalButtonBox>
            <YellowButton
              content="??????"
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
