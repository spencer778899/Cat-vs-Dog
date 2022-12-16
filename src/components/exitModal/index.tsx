import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BlueButton from '../buttons/blueButton';
import YellowButton from '../buttons/yellowButton';
import Modal from '../modal';

const ExitModalText = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 360px;
  height: 130px;
  margin: auto;
  font-size: 28px;
  text-align: center;
`;
const ExitModalButtons = styled.div`
  position: absolute;
  bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function ExitModal({ displayExitModalHandler }: { displayExitModalHandler: () => void }) {
  const navigate = useNavigate();
  return (
    <Modal title="提醒">
      <ExitModalText>
        離開會喪失所有遊戲進度
        <br />
        確定要離開嗎?
      </ExitModalText>
      <ExitModalButtons>
        <BlueButton
          content="離開"
          loading={false}
          onClick={() => {
            navigate('/');
          }}
        />
        <YellowButton content="返回遊戲" loading={false} onClick={displayExitModalHandler} />
      </ExitModalButtons>
    </Modal>
  );
}

export default ExitModal;
