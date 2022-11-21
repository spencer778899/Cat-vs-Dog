import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import backImg from '../../img/back.png';
import puppy1Img from '../../img/puppy1.png';
import puppy2Img from '../../img/puppy2.png';
import puppy3Img from '../../img/puppy3.png';
import puppy4Img from '../../img/puppy4.png';
import puppy5Img from '../../img/puppy5.png';
import github1Img from '../../img/github1.png';
import github2Img from '../../img/github2.png';
import hacker1Img from '../../img/hacker1.png';
import hacker2Img from '../../img/hacker2.png';
import YellowButton from '../../components/buttons/yellowButton';
import Modal from '../../components/modal';
import SelectLevelModalPreload from './selectLevelModalPreload';

interface AIgameProps {
  getAILevel: (level: number) => void;
}

const SelectLevelModalButtos = styled.div`
  margin-top: 80px;
`;
const SelectLevelModalBack = styled(Link)`
  position: absolute;
  top: 10px;
  left: 15px;
  width: 34px;
  height: 38px;
  background-image: url(${backImg});
  background-size: cover;
  cursor: pointer;

  &:hover {
    opacity: 90%;
  }
`;

const SelectLevelModalButton1Box = styled.div`
  position: relative;
  flex-direction: row-reverse;
  display: flex;
  align-items: center;
  width: 250px;
  margin-bottom: 70px;

  &:hover > #SelectLevelModalLevel1Img {
    animation-name: Level1Animation;
  }
`;

const SelectLevelModalLevel1Img = styled.div`
  position: absolute;
  left: 0px;
  width: 90px;
  height: 90px;
  background-image: url(${puppy1Img});
  background-size: cover;
  border: 4px solid #fff;
  border-radius: 50%;
  z-index: 1;
  animation-duration: 10s;

  @keyframes Level1Animation {
    0% {
      background-image: url(${puppy1Img});
    }
    2% {
      background-image: url(${puppy2Img});
    }
    4% {
      background-image: url(${puppy3Img});
    }
    6% {
      background-image: url(${puppy4Img});
    }
    8% {
      background-image: url(${puppy5Img});
    }
    100% {
      background-image: url(${puppy5Img});
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
  left: 0px;
  width: 90px;
  height: 90px;
  background-image: url(${github1Img});
  background-size: cover;
  border: 4px solid #fff;
  border-radius: 50%;
  z-index: 1;
  animation-duration: 10s;

  @keyframes Level2Animation {
    0% {
      background-image: url(${github1Img});
    }
    30% {
      background-image: url(${github2Img});
    }
    100% {
      background-image: url(${github2Img});
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
  left: 0px;
  width: 90px;
  height: 90px;
  background-image: url(${hacker1Img});
  background-size: cover;
  border: 4px solid #fff;
  border-radius: 50%;
  z-index: 1;
  animation-duration: 3s;
  animation-iteration-count: infinite;

  @keyframes Level3Animation {
    0% {
      background-image: url(${hacker1Img});
    }
    50% {
      background-image: url(${hacker2Img});
    }
    100% {
      background-image: url(${hacker1Img});
    }
  }
`;
function SelectLevelModal({ getAILevel }: AIgameProps) {
  return (
    <Modal title="難度選擇">
      <SelectLevelModalPreload />
      <SelectLevelModalBack to="/" />
      <SelectLevelModalButtos>
        <SelectLevelModalButton1Box>
          <SelectLevelModalLevel1Img id="SelectLevelModalLevel1Img" />
          <YellowButton
            content="Level 1"
            loading={false}
            onClick={() => {
              getAILevel(0.3);
            }}
          />
        </SelectLevelModalButton1Box>
        <SelectLevelModalButton2Box>
          <SelectLevelModalLevel2Img id="SelectLevelModalLevel2Img" />
          <YellowButton
            content="Level 2"
            loading={false}
            onClick={() => {
              getAILevel(0.6);
            }}
          />
        </SelectLevelModalButton2Box>
        <SelectLevelModalButton3Box>
          <SelectLevelModalLevel3Img id="SelectLevelModalLevel3Img" />
          <YellowButton
            content="Level 3"
            loading={false}
            onClick={() => {
              getAILevel(0.9);
            }}
          />
        </SelectLevelModalButton3Box>
      </SelectLevelModalButtos>
    </Modal>
  );
}

export default SelectLevelModal;
