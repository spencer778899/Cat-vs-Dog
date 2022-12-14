import LoginModal from './loginModal';
import RegisterModal from './registerModal';
import AccomplishmentModal from './accomplishmentModal';
import { useGlobalContext } from '../../context/authContext';
import YellowButton from '../../components/buttons/yellowButton';
import BlueButton from '../../components/buttons/blueButton';
import imageHub from '../../utils/imageHub';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React, { useState } from 'react';

const HomeMain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 940px;
  height: 560px;
  margin: auto;
  padding: 15px 20px;
  border-radius: 15px;
  background-color: #ffffff;
  box-shadow: 0 0 20px #00000090;
  z-index: -1;

  @media (max-width: 1125px) {
    display: none;
  }
`;
const HomeLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 10px;
  width: 80px;
  height: 40px;
  border-radius: 50px;
  background-color: #666666;
  color: #fff;

  cursor: pointer;
  &:hover {
    box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  }
`;
const HomeLogoBox = styled.div`
  position: absolute;
  top: -47px;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 75px;
  margin: auto;
  background-image: url(${imageHub.titleBarImg});
  background-size: cover;
`;
const HomeLogo = styled.div`
  margin-top: 15px;
  font-size: 28px;
  font-weight: bold;
`;
const HomeLogoCatImg = styled.div`
  position: absolute;
  top: 0;
  left: 40px;
  bottom: 0;
  width: 100px;
  height: 50px;
  margin: auto;
  background-image: url(${imageHub.catHeadImg});
  background-size: cover;
`;
const HomeLogoDogImg = styled.div`
  position: absolute;
  top: 0;
  right: 40px;
  bottom: 0;
  width: 100px;
  height: 60px;
  margin: auto;
  background-image: url(${imageHub.dogHeadImg});
  background-size: cover;
`;
const HomeLinkBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 49%;
  height: 400px;
  align-items: center;
  border: 20px;
`;
const HomeLinkText = styled.div`
  margin-bottom: 60px;
  font-size: 18px;
  color: #0257bc;
`;
const HomeButtonBox = styled.div`
  margin-bottom: 40px;
`;
const HomeDividingLine = styled.div`
  height: 400px;
  border-right: 2px solid #acacac;
`;
const HomeIntroductionBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 49%;
  height: 400px;
  padding: 0 10px 15px 30px;
  align-items: center;
  border: 20px;
`;
const HomeIntroductionText = styled.div`
  margin-bottom: 40px;
  font-size: 18px;
  color: #0257bc;
`;
const HomeIntroduction = styled.div`
  margin-bottom: 30px;
  font-size: 24px;
`;
const HomeCatIcon = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  background-image: url(${imageHub.catImg});
  background-size: cover;
`;
const HomeDogIcon = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  background-image: url(${imageHub.dogImg});
  background-size: cover;
`;
const HomeBallIcon = styled.div`
  display: inline-block;
  width: 28px;
  height: 28px;
  margin: 0 4px;
  border-radius: 50%;
  background-color: #000;
`;
const HomeSkillsIntroduction = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-bottom: 50px;
`;
const HomeSkillBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const HomePowerUpImg = styled.div`
  width: 50px;
  height: 50px;
  background-image: url(${imageHub.powerUpImg});
  background-size: cover;
`;
const HomeDoubleHitImg = styled.div`
  width: 50px;
  height: 50px;
  background-image: url(${imageHub.doubleHitImg});
  background-size: cover;
`;
const HomeHealImg = styled.div`
  width: 50px;
  height: 50px;
  background-image: url(${imageHub.healImg});
  background-size: cover;
`;
const HomeSkillsText = styled.div``;
const HomeNoteBox = styled.div``;
const HomeNoteImg = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  background-image: url(${imageHub.windIcon});
  background-size: cover;
`;

function Home() {
  const navigate = useNavigate();
  const { isLogin } = useGlobalContext();
  const [showModal, setShowModal] = useState<string>('none');

  function renderModal() {
    if (showModal === 'loginModal') {
      return <LoginModal setShowModal={setShowModal} />;
    }
    if (showModal === 'registerModal') {
      return <RegisterModal setShowModal={setShowModal} />;
    }
    if (showModal === 'accomplishmentModal') {
      return <AccomplishmentModal setShowModal={setShowModal} />;
    }
  }

  return (
    <div>
      {ReactDOM.createPortal(renderModal(), document?.getElementById('modal-root') as HTMLElement)}
      <HomeMain>
        {!isLogin && (
          <HomeLogin
            onClick={() => {
              setShowModal('loginModal');
            }}
          >
            ??????
          </HomeLogin>
        )}
        <HomeLogoBox>
          <HomeLogoCatImg />
          <HomeLogo>????????????</HomeLogo>
          <HomeLogoDogImg />
        </HomeLogoBox>
        <HomeLinkBox>
          <HomeLinkText>????????????</HomeLinkText>
          <HomeButtonBox>
            <YellowButton
              content="????????????"
              loading={false}
              onClick={() => {
                navigate('/game');
              }}
            />
          </HomeButtonBox>
          <HomeButtonBox>
            <YellowButton
              content="??????AI"
              loading={false}
              onClick={() => {
                navigate('/AIgame');
              }}
            />
          </HomeButtonBox>
          <HomeButtonBox>
            <YellowButton
              content="????????????"
              loading={false}
              onClick={() => {
                navigate('/onlinegame');
              }}
            />
          </HomeButtonBox>
          <HomeButtonBox>
            <BlueButton
              content="????????????"
              loading={false}
              onClick={() => {
                setShowModal('accomplishmentModal');
              }}
            />
          </HomeButtonBox>
        </HomeLinkBox>
        <HomeDividingLine />
        <HomeIntroductionBox>
          <HomeIntroductionText>????????????</HomeIntroductionText>
          <HomeIntroduction>
            ??????
            <HomeCatIcon />
            ???
            <HomeDogIcon />
            ????????????????????????????????????
            <HomeBallIcon />
            ??????????????????????????????????????????????????????
          </HomeIntroduction>
          <HomeSkillsIntroduction>
            <HomeSkillBox>
              <HomePowerUpImg />
              <HomeSkillsText>???????????????</HomeSkillsText>
            </HomeSkillBox>
            <HomeSkillBox>
              <HomeDoubleHitImg />
              <HomeSkillsText>????????????</HomeSkillsText>
            </HomeSkillBox>
            <HomeSkillBox>
              <HomeHealImg />
              <HomeSkillsText>????????????</HomeSkillsText>
            </HomeSkillBox>
          </HomeSkillsIntroduction>
          <HomeNoteBox>
            <HomeNoteImg />
            ????????????
            <HomeNoteImg />
          </HomeNoteBox>
        </HomeIntroductionBox>
      </HomeMain>
    </div>
  );
}

export default Home;
