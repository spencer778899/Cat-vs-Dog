import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

const WaitOpponentModalBody = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 98;
`;
const WaitOpponentModalMain = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 400px;
  height: 400px;
  margin: auto;
  padding: 100px 10px 0px 10px;
  z-index: 99;
  background-color: #ffffff;
  border-radius: 10px;
`;
const WaitOpponentModalURL = styled.input`
  width: 360px;
  height: 40px;
  margin-bottom: 30px;
  padding: 10px;
  border: 1px solid #797979;
  border-radius: 15px;
`;
const WaitOpponentModalCopy = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 186px;
  height: 40px;
  margin-bottom: 60px;
  border: 1px solid #797979;
  border-radius: 24px;
  cursor: pointer;
`;
const WaitOpponentModalText = styled.div``;
const WaitOpponentModalBack = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 20px;
  width: 70px;
  height: 50px;
  margin-bottom: -40px;
  border: 1px solid #000000;
  border-radius: 25px;
  font-size: 24px;
  text-decoration: none;
  color: #000000;
  background-color: #e6be3c;
`;

function WaitOpponentModal() {
  const urlParams = useParams();
  const URLInputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <WaitOpponentModalBody>
        <WaitOpponentModalMain>
          {urlParams.identity === 'host' ? (
            <>
              <WaitOpponentModalURL
                ref={URLInputRef}
                value={`${window.location.hostname}/onlinegame/${urlParams.roomID}/guest`}
                readOnly
              />
              <WaitOpponentModalCopy
                onClick={() => {
                  navigator.clipboard.writeText(URLInputRef?.current?.value || '');
                }}
              >
                複製邀請連結
              </WaitOpponentModalCopy>
            </>
          ) : (
            ''
          )}
          <WaitOpponentModalText>等待你的對手...</WaitOpponentModalText>
          <WaitOpponentModalBack to="/">返回</WaitOpponentModalBack>
        </WaitOpponentModalMain>
      </WaitOpponentModalBody>
    </div>
  );
}

export default WaitOpponentModal;
