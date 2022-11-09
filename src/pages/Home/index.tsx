import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import img from '../img/globalBackground.jpg';
import memberImg from './member.png';

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
const HomeMain = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 940px;
  height: 560px;
  margin: auto;
  padding: 10px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%); ;
`;
const HomeMemberBox = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 20px;
  right: 30px;
  width: auto;
  height: 40px;
`;
const HomeMemberIcon = styled.div`
  float: right;
  width: 40px;
  height: 40px;
  background-image: url(${memberImg});
  background-size: cover;
`;
const HomeMemberName = styled.div`
  float: right;
  margin-right: 10px;
  font-size: 24px;
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
  border: 2px solid #000000;
  border-radius: 15px;
  cursor: pointer;
`;
const HomeLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 150px;
  margin: 50px calc(50% - 150px);
  border: 1px solid #000000;
`;
const HomeLinkBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 20px;
`;
const HomeLocalGameLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 40px;
  margin: 20px 0;
  border: 1px solid #000000;
  border-radius: 20px;
  color: #000000;
  text-decoration: none;
`;
const HomeAIGameLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 40px;
  margin: 20px 0;
  border: 1px solid #000000;
  border-radius: 20px;
  color: #000000;
  text-decoration: none;
`;
const HomeOnlineGameLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 40px;
  margin: 20px;
  border: 1px solid #000000;
  border-radius: 20px;
  cursor: pointer;
`;
function Home() {
  return (
    <div>
      <Background />
      <HomeMain>
        <HomeMemberBox>
          <HomeMemberName>spencer</HomeMemberName>
          <HomeMemberIcon />
        </HomeMemberBox>
        <HomeLogin>登入</HomeLogin>
        <HomeLogo>貓狗大戰</HomeLogo>
        <HomeLinkBox>
          <HomeLocalGameLink to="game">本地對戰</HomeLocalGameLink>
          <HomeAIGameLink to="AIgame">對戰AI</HomeAIGameLink>
          <HomeOnlineGameLink>好友對戰</HomeOnlineGameLink>
        </HomeLinkBox>
      </HomeMain>
    </div>
  );
}

export default Home;
