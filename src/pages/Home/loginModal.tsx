import React from 'react';
import styled from 'styled-components';
import member from '../../img/member.png';
import email from '../../img/email.png';
import lock from '../../img/lock.png';

interface HomeProps {
  displayLoginModalHandler: (display: boolean) => void;
  displayRegisterModalHandler: (display: boolean) => void;
}

const LoginModalBody = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 22, 46, 0.68);
  z-index: 98;
`;
const LoginModalBack = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;
const LoginModalMain = styled.div`
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
const LoginModalImg = styled.div`
  width: 130px;
  height: 130px;
  margin-bottom: 20px;
  background-image: url(${member});
  background-size: cover;
`;
const LoginModalMailbox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 35px;
  margin-bottom: 20px;
`;
const LoginModalMailImg = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  background-image: url(${email});
  background-size: cover;
`;
const LoginModalMailText = styled.div`
  width: 112px;
  margin-right: 20px;
  font-size: 20px;
  color: #797979;
`;
const LoginModalMailInput = styled.input`
  height: 30px;
  border: 1px solid #79797979;
  border-radius: 5px;
`;
const LoginModalPasswordBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 35px;
  margin-bottom: 40px;
`;
const LoginModalPasswordImg = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  background-image: url(${lock});
  background-size: cover;
`;
const LoginModalPasswordText = styled.div`
  width: 112px;
  margin-right: 20px;
  font-size: 20px;
  color: #797979;
`;
const LoginModalPasswordInput = styled.input`
  height: 30px;
  border: 1px solid #79797979;
  border-radius: 5px;
`;
const LoginModalButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LoginModalLogin = styled.button`
  margin: 0 10px;
  width: 186px;
  height: 40px;
  border-radius: 24px;
  cursor: pointer;
`;
const LoginModalRegister = styled.button`
  margin: 0 10px;
  width: 186px;
  height: 40px;
  border-radius: 24px;
  cursor: pointer;
`;

function LoginModal({ displayLoginModalHandler, displayRegisterModalHandler }: HomeProps) {
  return (
    <div>
      <LoginModalBody>
        <LoginModalMain>
          <LoginModalBack
            onClick={() => {
              displayLoginModalHandler(false);
            }}
          >
            ✖
          </LoginModalBack>
          <LoginModalImg />
          <LoginModalMailbox>
            <LoginModalMailImg />
            <LoginModalMailText>電子郵件:</LoginModalMailText>
            <LoginModalMailInput />
          </LoginModalMailbox>
          <LoginModalPasswordBox>
            <LoginModalPasswordImg />
            <LoginModalPasswordText>密碼:</LoginModalPasswordText>
            <LoginModalPasswordInput />
          </LoginModalPasswordBox>
          <LoginModalButtonBox>
            <LoginModalLogin>登入</LoginModalLogin>
            <LoginModalRegister
              onClick={() => {
                displayLoginModalHandler(false);
                displayRegisterModalHandler(true);
              }}
            >
              註冊
            </LoginModalRegister>
          </LoginModalButtonBox>
        </LoginModalMain>
      </LoginModalBody>
    </div>
  );
}

export default LoginModal;
