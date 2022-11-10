import React from 'react';
import styled from 'styled-components';

interface HomeProps {
  displayInviteModalHandler: (display: boolean) => void;
}

const InviteModalBody = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 22, 46, 0.68);
  z-index: 98;
`;
const InviteModalBack = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;
const InviteModalMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 480px;
  height: 480px;
  margin: auto;
  padding: 80px 20px 20px 20px;
  border: 1px solid #000000;
  border-radius: 20px;
  background-color: #ffffff;
  z-index: 99;
`;
function InviteModal({ displayInviteModalHandler }: HomeProps) {
  return (
    <div>
      <InviteModalBody>
        <InviteModalMain>
          <InviteModalBack
            onClick={() => {
              displayInviteModalHandler(false);
            }}
          >
            ✖
          </InviteModalBack>
          <h1>Invite modal</h1>
        </InviteModalMain>
      </InviteModalBody>
    </div>
  );
}

export default InviteModal;
