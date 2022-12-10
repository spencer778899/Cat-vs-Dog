import LoginModal from './loginModal';
import RegisterModal from './registerModal';
import AccomplishmentModal from './accomplishmentModal';
import { useGlobalContext } from '../../context/authContext';
import YellowButton from '../../components/buttons/yellowButton';
import BlueButton from '../../components/buttons/blueButton';
import firestore from '../../utils/firestore';
import imageHub from '../../utils/imageHub';
import styled, { css } from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';

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
  const { isLogin, user } = useGlobalContext();
  const [showModal, setShowModal] = useState<string>('none');

  useEffect(() => {
    if (!isLogin) return;
    if (user.friends?.length === 1) {
      firestore.updateGoal1ProgressRate(user.uid, 1);
    }
    if (user.friends?.length === 2) {
      firestore.achieveGoal1(user?.uid);
      firestore.updateChangePhotoRight(user?.uid);
    }
  }, [isLogin, user.friends, user.uid]);

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
            登入
          </HomeLogin>
        )}
        <HomeLogoBox>
          <HomeLogoCatImg />
          <HomeLogo>貓狗大戰</HomeLogo>
          <HomeLogoDogImg />
        </HomeLogoBox>
        <HomeLinkBox>
          <HomeLinkText>遊戲模式</HomeLinkText>
          <HomeButtonBox>
            <YellowButton
              content="本地對戰"
              loading={false}
              onClick={() => {
                navigate('/game');
              }}
            />
          </HomeButtonBox>
          <HomeButtonBox>
            <YellowButton
              content="對戰AI"
              loading={false}
              onClick={() => {
                navigate('/AIgame');
              }}
            />
          </HomeButtonBox>
          <HomeButtonBox>
            <YellowButton
              content="好友對戰"
              loading={false}
              onClick={() => {
                navigate('/onlinegame');
              }}
            />
          </HomeButtonBox>
          <HomeButtonBox>
            <BlueButton
              content="成就系統"
              loading={false}
              onClick={() => {
                setShowModal('accomplishmentModal');
              }}
            />
          </HomeButtonBox>
        </HomeLinkBox>
        <HomeDividingLine />
        <HomeIntroductionBox>
          <HomeIntroductionText>遊戲介紹</HomeIntroductionText>
          <HomeIntroduction>
            操縱
            <HomeCatIcon />
            或
            <HomeDogIcon />
            在各自的回合長按角色投擲
            <HomeBallIcon />
            攻擊對手，直到一方血量歸零遊戲結束。
          </HomeIntroduction>
          <HomeSkillsIntroduction>
            <HomeSkillBox>
              <HomePowerUpImg />
              <HomeSkillsText>攻擊巨大化</HomeSkillsText>
            </HomeSkillBox>
            <HomeSkillBox>
              <HomeDoubleHitImg />
              <HomeSkillsText>雙倍傷害</HomeSkillsText>
            </HomeSkillBox>
            <HomeSkillBox>
              <HomeHealImg />
              <HomeSkillsText>回復血量</HomeSkillsText>
            </HomeSkillBox>
          </HomeSkillsIntroduction>
          <HomeNoteBox>
            <HomeNoteImg />
            注意風向
            <HomeNoteImg />
          </HomeNoteBox>
        </HomeIntroductionBox>
      </HomeMain>
    </div>
  );
}

export default Home;
