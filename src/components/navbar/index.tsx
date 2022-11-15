import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
import firestore, { db } from '../../utils/firestore';
import { useGlobalContext } from '../../context/authContext';
import friendsImg from '../../img/friends.png';
import notificationImg from '../../img/bell.png';
import Friends from './frineds';

const NavbarBody = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 5px;
  left: 10px;
`;
const NavbarPlayer = styled.div`
  display: flex;
  align-items: center;
  width: 150px;
  padding: 5px 10px;
  background-color: #ffffff;
  border-radius: 15px;
`;
const NavbarPlayerImg = styled.div<{ img: string }>`
  width: 35px;
  height: 35px;
  margin-right: 15px;
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
  border-radius: 50%;
  background-color: #ffffff;
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
const NavbarInvitationBox = styled.div<{ $display: boolean; invitation: string | undefined }>`
  display: ${(p) => (p.$display && p.invitation ? 'flex' : 'none')};
  align-items: center;
  height: 50px;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #000000;
  border-radius: 15px;
`;
const NavbarInvitationImg = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
  background-image: url(${friendsImg});
  background-size: cover;
`;
const NavbarInvitationName = styled.div`
  margin-right: 10px;
`;
const NavbarAgreeInvitation = styled.button``;
function Navbar() {
  const { isLogin, user } = useGlobalContext();
  const navigate = useNavigate();
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
  async function agreeGameInvitation() {
    if (isLogin === false || user.uid === undefined) return;
    firestore.updateInviting(user.uid, '');
    navigate(`${user.inviting}`);
  }
  async function rejectGameInvitation() {
    if (isLogin === false || user.uid === undefined) return;
    firestore.updateInviting(user.uid, '');
  }
  return (
    <div>
      {isLogin && user.photoURL && user.nickname ? (
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
            <NavbarInvitationBox $display={displayInvitationCol} invitation={user?.inviting}>
              <NavbarInvitationImg />
              <NavbarInvitationName>{user?.inviting}</NavbarInvitationName>
              <NavbarAgreeInvitation
                onClick={() => {
                  agreeGameInvitation();
                }}
              >
                接受
              </NavbarAgreeInvitation>
              <NavbarAgreeInvitation
                onClick={() => {
                  rejectGameInvitation();
                }}
              >
                拒絕
              </NavbarAgreeInvitation>
            </NavbarInvitationBox>
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
          <NavbarFriendsBox $display={displayFriendsCol}>
            <Friends invitationList={invitationList} />
          </NavbarFriendsBox>
        </NavbarBody>
      ) : (
        ''
      )}
    </div>
  );
}

export default Navbar;
