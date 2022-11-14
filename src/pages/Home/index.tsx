import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import LoginModal from './loginModal';
import RegisterModal from './registerModal';
import InviteModal from './inviteModal';
import AccomplishmentModal from './accomplishmentModal';

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
  box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  z-index: -1;
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
  &:hover {
    box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  }
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
  margin: 10px 0;
  border: 1px solid #000000;
  border-radius: 20px;
  color: #000000;
  text-decoration: none;
  &:hover {
    box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  }
`;
const HomeAIGameLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 40px;
  margin: 10px 0;
  border: 1px solid #000000;
  border-radius: 20px;
  color: #000000;
  text-decoration: none;
  &:hover {
    box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  }
`;
const HomeOnlineGameLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 40px;
  margin: 10px;
  border: 1px solid #000000;
  border-radius: 20px;
  color: #000000;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  }
`;
const HomeAccomplishmentLink = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 40px;
  margin: 10px;
  border: 1px solid #000000;
  border-radius: 20px;
  color: #000000;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  }
`;
function Home() {
  const [displayLoginModal, setDisplayLoginModal] = useState(false);
  const [displayRegisterModal, setDisplayRegisterModal] = useState(false);
  const [displayInviteModal, setDisplayInviteModal] = useState(false);
  const [displayAccomplishmentModal, setDisplayAccomplishmentModal] = useState(false);
  const displayLoginModalHandler = (display: boolean) => {
    setDisplayLoginModal(display);
  };

  const displayRegisterModalHandler = (display: boolean) => {
    setDisplayRegisterModal(display);
  };

  const displayInviteModalHandler = (display: boolean) => {
    setDisplayInviteModal(display);
  };

  const displayAccomplishmentModalHandler = (display: boolean) => {
    setDisplayAccomplishmentModal(display);
  };

  return (
    <div>
      {
        // prettier-ignore
        displayLoginModal ?
          ReactDOM.createPortal(
            <LoginModal
              displayLoginModalHandler={displayLoginModalHandler}
              displayRegisterModalHandler={displayRegisterModalHandler}
            />,
            document?.getElementById('modal-root') as HTMLElement,
          ) :
          ''
      }
      {
        // prettier-ignore
        displayRegisterModal ?
          ReactDOM.createPortal(
            <RegisterModal
              displayLoginModalHandler={displayLoginModalHandler}
              displayRegisterModalHandler={displayRegisterModalHandler}
            />,
            document?.getElementById('modal-root') as HTMLElement,
          ) :
          ''
      }
      {
        // prettier-ignore
        displayInviteModal ?
          ReactDOM.createPortal(
            <InviteModal
              displayInviteModalHandler={displayInviteModalHandler}
            />,
            document?.getElementById('modal-root') as HTMLElement,
          ) :
          ''
      }
      {
        // prettier-ignore
        displayAccomplishmentModal ?
          ReactDOM.createPortal(
            <AccomplishmentModal
              displayAccomplishmentModalHandler={displayAccomplishmentModalHandler}
              displayLoginModalHandler={displayLoginModalHandler}
            />,
            document?.getElementById('modal-root') as HTMLElement,
          ) :
          ''
      }
      <HomeMain>
        <HomeLogin
          onClick={() => {
            setDisplayLoginModal(true);
          }}
        >
          登入
        </HomeLogin>
        <HomeLogo>貓狗大戰</HomeLogo>
        <HomeLinkBox>
          <HomeLocalGameLink to="game">本地對戰</HomeLocalGameLink>
          <HomeAIGameLink to="AIgame">對戰AI</HomeAIGameLink>
          <HomeOnlineGameLink to="onlinegame">好友對戰</HomeOnlineGameLink>
          <HomeAccomplishmentLink
            onClick={() => {
              displayAccomplishmentModalHandler(true);
            }}
          >
            成就系統
          </HomeAccomplishmentLink>
        </HomeLinkBox>
      </HomeMain>
    </div>
  );
}

export default Home;
