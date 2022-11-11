import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/authContext';
import emailImg from '../../img/email.png';
import lockImg from '../../img/lock.png';
import nicknameImg from '../../img/nickname.png';
import memberImg from '../../img/member.png';
import firestore, { authentication, firestorage } from '../../utils/firestore';

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
const LoginModalImg = styled.div<{ background: string | undefined }>`
  width: 130px;
  height: 130px;
  margin-bottom: 20px;
  background-image: url(${(p) => p.background || memberImg});
  background-size: cover;
`;
const LoginModalHeadBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const LoginModalHeadInput = styled.input``;
const LoginModalHeadButton = styled.button``;
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
  background-image: url(${emailImg});
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
  background-image: url(${lockImg});
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
const LoginModalNicknameBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 35px;
  margin-bottom: 40px;
`;
const LoginModalNicknameImg = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  background-image: url(${nicknameImg});
  background-size: cover;
`;
const LoginModalNicknameText = styled.div`
  width: 112px;
  margin-right: 20px;
  font-size: 20px;
  color: #797979;
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
const LoginModalLogout = styled(LoginModalRegister)``;

function LoginModal({ displayLoginModalHandler, displayRegisterModalHandler }: HomeProps) {
  const regexp = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  const { isLogin, user } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [newPhoto, setNewPhoto] = useState<File>();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  async function updateHeadImg() {
    setIsLoading(true);
    if (newPhoto === undefined || user.uid === undefined || user.uid === undefined) return;
    const photoURL = await firestorage.uploadPhotoURL(newPhoto, user.uid);
    if (photoURL === undefined) return;
    await firestore.updatePhotoURL(user.uid, photoURL);
    setIsLoading(false);
  }
  async function submit() {
    setIsLoading(true);
    if (!email.current?.value.trim() || regexp.test(email.current?.value.trim()) === false) {
      alert('請輸入正確的email!');
    } else if (!password.current?.value.trim() || password.current?.value.trim().length < 6) {
      alert('請輸入至少六位數密碼!(不能輸入空白)');
    } else {
      await authentication.signIn(email.current?.value, password.current?.value);
      email.current.value = '';
      password.current.value = '';
      displayLoginModalHandler(false);
    }
    setIsLoading(false);
  }

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
          <LoginModalImg background={user.photoURL} />
          {isLogin ? (
            <LoginModalHeadBox>
              <LoginModalHeadInput
                type="file"
                onChange={(e) => {
                  if (e.target.files === null) return;
                  setNewPhoto(e.target.files[0]);
                }}
              />
              <LoginModalHeadButton
                onClick={() => {
                  if (isLoading === false) {
                    updateHeadImg();
                  }
                }}
              >
                更新頭貼
              </LoginModalHeadButton>
            </LoginModalHeadBox>
          ) : (
            ''
          )}
          <LoginModalMailbox>
            <LoginModalMailImg />
            <LoginModalMailText>電子郵件:</LoginModalMailText>
            {isLogin ? <p>{user.email}</p> : <LoginModalMailInput ref={email} />}
          </LoginModalMailbox>
          {isLogin ? (
            <LoginModalNicknameBox>
              <LoginModalNicknameImg />
              <LoginModalNicknameText>暱稱:</LoginModalNicknameText>
              <p>{user.nickname}</p>
            </LoginModalNicknameBox>
          ) : (
            <LoginModalPasswordBox>
              <LoginModalPasswordImg />
              <LoginModalPasswordText>密碼:</LoginModalPasswordText>
              <LoginModalPasswordInput ref={password} />
            </LoginModalPasswordBox>
          )}
          {isLogin ? (
            <LoginModalButtonBox>
              <LoginModalLogout
                onClick={() => {
                  if (isLoading === true) return;
                  authentication.signOut();
                }}
              >
                登出
              </LoginModalLogout>
            </LoginModalButtonBox>
          ) : (
            <LoginModalButtonBox>
              <LoginModalLogin
                onClick={() => {
                  if (isLoading === false) {
                    submit();
                  }
                }}
              >
                登入
              </LoginModalLogin>
              <LoginModalRegister
                onClick={() => {
                  displayLoginModalHandler(false);
                  displayRegisterModalHandler(true);
                }}
              >
                註冊
              </LoginModalRegister>
            </LoginModalButtonBox>
          )}
        </LoginModalMain>
      </LoginModalBody>
    </div>
  );
}

export default LoginModal;
