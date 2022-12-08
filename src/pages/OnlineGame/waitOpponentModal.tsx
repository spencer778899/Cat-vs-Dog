import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import YellowButton from '../../components/buttons/yellowButton';
import Modal from '../../components/modal';
import imageHub from '../../utils/imageHub';
import firestore from '../../utils/firestore';

const WaitOpponentModalText = styled.div`
  width: 288px;
  height: 100px;
  margin-top: 100px;
  font-size: 32px;
  text-align: center;
  animation: textAnimation 3s linear infinite;

  @keyframes textAnimation {
    0% {
      opacity: 100%;
    }
    50% {
      opacity: 20%;
    }
    100% {
      opacity: 100%;
    }
  }
`;
const WaitOpponentModalURL = styled.input`
  width: 360px;
  height: 40px;
  margin: 40px 0 30px 0;
  padding: 10px;
  border: 3px solid #797979;
  border-radius: 15px;
`;
const WaitOpponentModalBack = styled(Link)`
  position: absolute;
  top: 10px;
  left: 15px;
  width: 34px;
  height: 38px;
  background-image: url(${imageHub.backImg});
  background-size: cover;
  cursor: pointer;

  &:hover {
    opacity: 90%;
  }
`;

function WaitOpponentModal() {
  const urlParams = useParams();
  const URLInputRef = useRef<HTMLInputElement>(null);

  const URLcopyHandler = () => {
    navigator.clipboard.writeText(URLInputRef?.current?.value || '');
  };
  async function clearInvitation() {
    if (urlParams.friendEmail) {
      firestore.cleanInviting(urlParams.friendEmail);
    }
    await firestore.updateRoomState(
      urlParams.roomID,
      urlParams.identity === 'host' ? 'hostLeave' : 'guestLeave',
    );
  }
  return (
    <Modal title="邀請你的好友!">
      <WaitOpponentModalBack
        onClick={() => {
          clearInvitation();
        }}
        to="/"
      />
      <WaitOpponentModalText>等待你的對手．．．</WaitOpponentModalText>
      {urlParams.identity === 'host' ? (
        <>
          <WaitOpponentModalURL
            ref={URLInputRef}
            value={`https://${window.location.hostname}/onlinegame/${urlParams.roomID}/guest`}
            readOnly
          />
          <YellowButton content="複製連結" loading={false} onClick={URLcopyHandler} />
        </>
      ) : (
        ''
      )}
    </Modal>
  );
}

export default WaitOpponentModal;
