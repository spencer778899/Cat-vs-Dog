import SelectLevelModalPreload from './selectLevelModalPreload';
import YellowButton from '../../components/buttons/yellowButton';
import Modal from '../../components/modal';
import imageHub from '../../utils/imageHub';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface AIgameProps {
  getAILevel: (level: number) => void;
}

const SelectLevelModalButtons = styled.div`
  margin-top: 80px;
`;
const SelectLevelModalBack = styled(Link)`
  position: absolute;
  top: 10px;
  left: 15px;
  width: 34px;
  height: 38px;
  background-image: url(${imageHub.backImg});
  background-size: cover;
  cursor: pointer;

  &:hover {
    opacity: 90%;
  }
`;

const SelectLevelModalButton1Box = styled.div`
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 250px;
  margin-bottom: 70px;

  &:hover > #SelectLevelModalLevel1Img {
    animation-name: Level1Animation;
  }
`;

const SelectLevelModalLevel1Img = styled.div`
  position: absolute;
  left: -10px;
  width: 90px;
  height: 90px;
  background-image: url(${imageHub.puppy1Img});
  background-size: cover;
  border: 4px solid #fff;
  border-radius: 50%;
  z-index: 1;
  animation-duration: 10s;

  @keyframes Level1Animation {
    0% {
      background-image: url(${imageHub.puppy1Img});
    }
    2% {
      background-image: url(${imageHub.puppy2Img});
    }
    4% {
      background-image: url(${imageHub.puppy3Img});
    }
    6% {
      background-image: url(${imageHub.puppy4Img});
    }
    8% {
      background-image: url(${imageHub.puppy5Img});
    }
    100% {
      background-image: url(${imageHub.puppy5Img});
    }
  }
`;
const SelectLevelModalButton2Box = styled.div`
  position: relative;
  flex-direction: row-reverse;
  display: flex;
  align-items: center;
  width: 250px;
  margin-bottom: 70px;

  &:hover > #SelectLevelModalLevel2Img {
    animation-name: Level2Animation;
  }
`;

const SelectLevelModalLevel2Img = styled.div`
  position: absolute;
  left: -10px;
  width: 90px;
  height: 90px;
  background-image: url(${imageHub.github1Img});
  background-size: cover;
  border: 4px solid #fff;
  border-radius: 50%;
  z-index: 1;
  animation-duration: 10s;

  @keyframes Level2Animation {
    0% {
      background-image: url(${imageHub.github1Img});
    }
    30% {
      background-image: url(${imageHub.github2Img});
    }
    100% {
      background-image: url(${imageHub.github2Img});
    }
  }
`;
const SelectLevelModalButton3Box = styled.div`
  position: relative;
  flex-direction: row-reverse;
  display: flex;
  align-items: center;
  width: 250px;
  margin-bottom: 50px;

  &:hover > #SelectLevelModalLevel3Img {
    animation-name: Level3Animation;
  }
`;

const SelectLevelModalLevel3Img = styled.div`
  position: absolute;
  left: -10px;
  width: 90px;
  height: 90px;
  background-image: url(${imageHub.hacker1Img});
  background-size: cover;
  border: 4px solid #fff;
  border-radius: 50%;
  z-index: 1;
  animation-duration: 3s;
  animation-iteration-count: infinite;

  @keyframes Level3Animation {
    0% {
      background-image: url(${imageHub.hacker1Img});
    }
    50% {
      background-image: url(${imageHub.hacker2Img});
    }
    100% {
      background-image: url(${imageHub.hacker1Img});
    }
  }
`;
function SelectLevelModal({ getAILevel }: AIgameProps) {
  return (
    <Modal title="難度選擇">
      <SelectLevelModalPreload />
      <SelectLevelModalBack to="/" />
      <SelectLevelModalButtons>
        <SelectLevelModalButton1Box>
          <SelectLevelModalLevel1Img id="SelectLevelModalLevel1Img" />
          <YellowButton
            content="Level 1(簡單)"
            loading={false}
            onClick={() => {
              getAILevel(0.3);
            }}
          />
        </SelectLevelModalButton1Box>
        <SelectLevelModalButton2Box>
          <SelectLevelModalLevel2Img id="SelectLevelModalLevel2Img" />
          <YellowButton
            content="Level 2(普通)"
            loading={false}
            onClick={() => {
              getAILevel(0.6);
            }}
          />
        </SelectLevelModalButton2Box>
        <SelectLevelModalButton3Box>
          <SelectLevelModalLevel3Img id="SelectLevelModalLevel3Img" />
          <YellowButton
            content="Level 3(困難)"
            loading={false}
            onClick={() => {
              getAILevel(0.9);
            }}
          />
        </SelectLevelModalButton3Box>
      </SelectLevelModalButtons>
    </Modal>
  );
}

export default SelectLevelModal;
