import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firestore';
import { useGlobalContext } from '../../context/authContext';
import friendsImg from '../../img/friends.png';
import notificationImg from '../../img/bell.png';
import Friends from './frineds';
import Invitation from './invitation';

const NavbarBody = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 15px;
  left: 20px;
`;
const NavbarPlayer = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  height: 50px;
  padding: 5px 20px;
  background-color: #ffffff;
  border: 3px solid #acacac;
  border-radius: 15px;
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
const NavbarImgBox = styled.div`
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
`;
const NavbarInvitationBox = styled.div<{ $display: boolean }>`
  display: ${(p) => (p.$display ? 'flex' : 'none')};
`;
function Navbar() {
  const { isLogin, user } = useGlobalContext();
  const [invitationList, setInvitationList] = useState<
    { uid: string; nickname: string; photoURL: string }[]
  >([]);
  const [displayFriendsCol, setDisplayFriendsCol] = useState(false);
  const [displayInvitationCol, setDisplayInvitationCol] = useState(false);

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
  return (
    <div>
      {isLogin && user.photoURL && user.nickname ? (
        <>
          <NavbarBody>
            <NavbarPlayer>
              <NavbarPlayerImg img={user?.photoURL} />
              <NavbarPlayerName>{user.nickname}</NavbarPlayerName>
            </NavbarPlayer>
            <NavbarNotificationBox>
              <NavbarImgBox
                onClick={() => {
                  if (displayInvitationCol) {
                    setDisplayInvitationCol(false);
                  } else if (!displayInvitationCol) {
                    setDisplayInvitationCol(true);
                  }
                }}
              >
                <NavbarFriendsCol />
              </NavbarImgBox>
            </NavbarNotificationBox>
            <NavbarImgBox
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
          <NavbarInvitationBox $display={displayInvitationCol}>
            <Invitation />
          </NavbarInvitationBox>
          <NavbarFriendsBox $display={displayFriendsCol}>
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
