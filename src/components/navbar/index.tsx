import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firestore';
import { useGlobalContext } from '../../context/authContext';
import friendsImg from '../../img/friends.png';
import notificationImg from '../../img/bell.png';
import LoginModal from '../../pages/Home/loginModal';
import Friends from './frineds';
import Invitation from './invitation';
import useOnClickOutside from '../../utils/useOnClickOutside';

const NavbarBody = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 15px;
  left: 20px;
  cursor: pointer;
`;
const NavbarPlayer = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  height: 50px;
  padding: 5px 20px;
  background-color: #ffffff;
  border: 3px solid #d6d6d6;
  border-radius: 15px;

  &:hover {
    background-color: #d6d6d6;
    box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  }
`;
const NavbarPlayerImg = styled.div<{ img: string }>`
  width: 40px;
  height: 40px;
  margin-right: 15px;
  border-radius: 50%;
  background-image: url(${(p) => p.img});
  background-size: cover;
`;
const NavbarPlayerName = styled.div`
  font-size: 24px;
`;
const NavbarImgBox = styled.div<{ $display: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  margin: 10px 10px 5px 10px;
  border: 2px solid #000;
  border-radius: 50%;
  background-color: #ffbf00;
  border-top-color: #ffe100;
  border-right-color: #ffe100;
  border-left-color: #ffe100;
  border-bottom-color: #ffe100;
  box-shadow: 0 0 0 4px #002043, 0 0 0 5px #7c92b0;
  pointer-events: ${(p) => (p.$display ? 'none' : 'auto')};
  cursor: pointer;

  &:hover {
    border-top-color: #f88700;
    border-right-color: #f88700;
    border-right-color: #f88700;
    border-left-color: #f88700;
  }
`;
const NavbarFriendsCol = styled.div`
  width: 35px;
  height: 35px;
  background-image: url(${notificationImg});
  background-size: contain;
`;
const NavbarNotification = styled.div`
  width: 35px;
  height: 35px;
  background-image: url(${friendsImg});
  background-size: cover;
`;
const NavbarFriendsBox = styled.div<{ $display: boolean }>`
  display: ${(p) => (p.$display ? 'block' : 'none')};
`;
const NavbarNotificationBox = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;
const NavbarInvitationReminder = styled.div<{ isInvitation: string | undefined }>`
  display: ${(p) => (p.isInvitation ? 'relative' : ' none')};
  position: absolute;
  left: 42px;
  top: 18px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #e60000;
`;
const NavbarInvitationBox = styled.div<{ $display: boolean }>`
  display: ${(p) => (p.$display ? 'flex' : 'none')};
  position: relative;
`;

function Navbar() {
  const { isLogin, user } = useGlobalContext();
  const [invitationList, setInvitationList] = useState<
    { uid: string; nickname: string; photoURL: string }[]
  >([]);
  const [displayLoginModal, setDisplayLoginModal] = useState(false);
  const [displayFriendsCol, setDisplayFriendsCol] = useState(false);
  const [displayInvitationCol, setDisplayInvitationCol] = useState(false);
  const invitationBoxRef = useRef<HTMLDivElement>(null);
  const friendBoxRef = useRef<HTMLDivElement>(null);
  const displayLoginModalHandler = (display: boolean) => {
    setDisplayLoginModal(display);
  };

  useOnClickOutside(invitationBoxRef, () => {
    setDisplayInvitationCol(false);
  });
  useOnClickOutside(friendBoxRef, () => {
    setDisplayFriendsCol(false);
  });

  useEffect(() => {
    setInvitationList([]);
    if (isLogin === false) return;
    const friendRequestSubscribe = onSnapshot(
      collection(db, 'friendRequest', `${user?.email}`, 'invitation'),
      (res) => {
        const newList: { uid: string; nickname: string; photoURL: string }[] = [];
        res.forEach((docs) => {
          const data = docs.data();
          newList.push({
            uid: data.uid,
            nickname: data.nickname,
            photoURL: data.photoURL,
          });
        });
        setInvitationList(newList);
      },
    );
    return () => {
      friendRequestSubscribe();
    };
  }, [isLogin]);

  useEffect(() => {
    if (user.inviting?.URL) {
      setDisplayInvitationCol(true);
    } else {
      setDisplayInvitationCol(false);
    }
  }, [user.inviting]);
  return (
    <div>
      {
        // prettier-ignore
        displayLoginModal ?
          ReactDOM.createPortal(
            <LoginModal
              displayLoginModalHandler={displayLoginModalHandler}
              displayRegisterModalHandler={() => {
                // login state can't register new account
              }}
            />,
            document?.getElementById('modal-root') as HTMLElement,
          ) :
          ''
      }
      {isLogin && user.photoURL && user.nickname ? (
        <>
          <NavbarBody>
            <NavbarPlayer
              onClick={() => {
                setDisplayLoginModal(true);
              }}
            >
              <NavbarPlayerImg img={user?.photoURL} />
              <NavbarPlayerName>{user.nickname}</NavbarPlayerName>
            </NavbarPlayer>
            <NavbarNotificationBox>
              <NavbarInvitationReminder isInvitation={user?.inviting?.URL} />
              <NavbarImgBox
                $display={displayInvitationCol}
                onClick={() => {
                  if (!displayInvitationCol) {
                    setDisplayInvitationCol(true);
                  }
                }}
              >
                <NavbarFriendsCol />
              </NavbarImgBox>
            </NavbarNotificationBox>
            <NavbarImgBox
              $display={displayFriendsCol}
              onClick={() => {
                if (displayFriendsCol) {
                  setDisplayFriendsCol(false);
                } else if (!displayFriendsCol) {
                  setDisplayFriendsCol(true);
                }
              }}
            >
              <NavbarNotification />
            </NavbarImgBox>
          </NavbarBody>
          <NavbarInvitationBox ref={invitationBoxRef} $display={displayInvitationCol}>
            <Invitation />
          </NavbarInvitationBox>
          <NavbarFriendsBox ref={friendBoxRef} $display={displayFriendsCol}>
            <Friends invitationList={invitationList} />
          </NavbarFriendsBox>
        </>
      ) : (
        ''
      )}
    </div>
  );
}

export default Navbar;
