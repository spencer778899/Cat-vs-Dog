import Friends from './Frineds';
import Invitation from './Invitation';
import { db } from '../../utils/firestore';
import { useGlobalContext } from '../../context/AuthContext';
import imageHub from '../../utils/imageHub';
import LoginModal from '../../pages/Home/LoginModal';
import useOnClickOutside from '../../utils/useOnClickOutside';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { collection, onSnapshot } from 'firebase/firestore';

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
const NavbarImgBox = styled.div<{ show: boolean }>`
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
  pointer-events: ${(p) => (p.show ? 'none' : 'auto')};
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
  background-image: url(${imageHub.notificationImg});
  background-size: contain;
`;
const NavbarNotification = styled.div`
  width: 35px;
  height: 35px;
  background-image: url(${imageHub.friendsImg});
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
  const [showModal, setShowModal] = useState('none');
  const [showFriendsCol, setShowFriendsCol] = useState(false);
  const [showInvitationCol, setShowInvitationCol] = useState(false);
  const invitationBoxRef = useRef<HTMLDivElement>(null);
  const friendBoxRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(invitationBoxRef, () => {
    setShowInvitationCol(false);
  });
  useOnClickOutside(friendBoxRef, () => {
    setShowFriendsCol(false);
  });

  useEffect(() => {
    setInvitationList([]);
    if (!isLogin || !user.email) return;
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
  }, [isLogin, user?.email]);

  useEffect(() => {
    if (user.inviting?.URL) {
      setShowInvitationCol(true);
      return;
    }
    setShowInvitationCol(false);
  }, [user.inviting]);
  return (
    <div>
      {showModal === 'loginModal' &&
        ReactDOM.createPortal(
          <LoginModal setShowModal={setShowModal} />,
          document?.getElementById('modal-root') as HTMLElement,
        )}
      {isLogin && (
        <>
          <NavbarBody>
            <NavbarPlayer
              onClick={() => {
                setShowModal('loginModal');
              }}
            >
              <NavbarPlayerImg img={user.photoURL} />
              <NavbarPlayerName>{user.nickname}</NavbarPlayerName>
            </NavbarPlayer>
            <NavbarNotificationBox>
              <NavbarInvitationReminder isInvitation={user.inviting?.URL} />
              <NavbarImgBox
                show={showInvitationCol}
                onClick={() => {
                  setShowInvitationCol((pre) => !pre && true);
                }}
              >
                <NavbarFriendsCol />
              </NavbarImgBox>
            </NavbarNotificationBox>
            <NavbarImgBox
              show={showFriendsCol}
              onClick={() => {
                setShowFriendsCol((pre) => !pre);
              }}
            >
              <NavbarNotification />
            </NavbarImgBox>
          </NavbarBody>
          <NavbarInvitationBox ref={invitationBoxRef} $display={showInvitationCol}>
            <Invitation />
          </NavbarInvitationBox>
          <NavbarFriendsBox ref={friendBoxRef} $display={showFriendsCol}>
            <Friends invitationList={invitationList} showFriendsCol={showFriendsCol} />
          </NavbarFriendsBox>
        </>
      )}
    </div>
  );
}

export default Navbar;
