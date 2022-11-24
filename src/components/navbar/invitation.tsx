import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/authContext';
import firestore from '../../utils/firestore';
import circleImg from '../../img/circle.png';

const InvitationBody = styled.div`
  position: absolute;
  top: 76px;
  left: 88px;
`;
const InvitationMain = styled.div`
  display: flex;
  align-items: center;
  width: auto;
  height: 48px;
  padding-left: 15px;
  background-color: #ffffff;
  box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  border-radius: 15px;
`;

const InvitationImg = styled.div<{ img: string }>`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
  background-image: url(${(p) => p.img});
  background-size: cover;
`;
const InvitationName = styled.div`
  margin-right: 15px;
`;
const InvitationAgree = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-right: 15px;
  border: 3px solid #000;
  border-radius: 50%;
  border-top-color: #ffe100;
  border-right-color: #ffe100;
  border-left-color: #ffe100;
  border-bottom-color: #f88700;
  background-image: url(${circleImg});
  background-size: 35px cover;
  background-color: #ffbf00;
  box-shadow: 0 0 0 4px #002043, 0 0 0 5px #7c92b0;
  font-size: 18px;
  cursor: pointer;
`;
const InvitationReject = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-right: 15px;
  border: 3px solid #000;
  border-radius: 50%;
  border-top-color: #66cfff;
  border-right-color: #66cfff;
  border-left-color: #66cfff;
  border-bottom-color: #248aed;
  background-image: url(${circleImg});
  background-size: 35px cover;
  background-color: #13bafe;
  box-shadow: 0 0 0 4px #002043, 0 0 0 5px #7c92b0;
  font-size: 18px;
  cursor: pointer;
`;
function Invitation() {
  const { isLogin, user } = useGlobalContext();
  const navigate = useNavigate();

  async function agreeGameInvitation() {
    if (isLogin === false || user.uid === undefined) return;
    firestore.updateInviting(user.uid, {});
    navigate(`${user.inviting}`);
  }
  async function rejectGameInvitation() {
    if (isLogin === false || user.uid === undefined) return;
    firestore.updateInviting(user.uid, {});
  }

  return (
    <InvitationBody>
      {user.inviting?.URL ? (
        <InvitationMain>
          <InvitationImg img={user?.inviting.photoURL} />
          <InvitationName>{`${user?.inviting.nickname}邀請你進入遊戲~`}</InvitationName>
          <InvitationAgree
            onClick={() => {
              agreeGameInvitation();
            }}
          >
            ✔
          </InvitationAgree>
          <InvitationReject
            onClick={() => {
              rejectGameInvitation();
            }}
          >
            ✘
          </InvitationReject>
        </InvitationMain>
      ) : (
        <InvitationMain>
          <InvitationName>暫無邀請~QQ</InvitationName>
        </InvitationMain>
      )}
    </InvitationBody>
  );
}

export default Invitation;
