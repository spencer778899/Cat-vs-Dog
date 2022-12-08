import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useGlobalContext } from '../../context/authContext';
import imageHub from '../../utils/imageHub';
import firestore, { authentication, firestorage } from '../../utils/firestore';
import Modal from '../../components/modal';
import BlueButton from '../../components/buttons/blueButton';
import YellowButton from '../../components/buttons/yellowButton';

interface HomeProps {
  displayLoginModalHandler: (display: boolean) => void;
  displayRegisterModalHandler: (display: boolean) => void;
}

const LoginModalBack = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
`;
const LoginModalImg = styled.div<{ background: string | undefined }>`
  position: relative;
  width: 130px;
  height: 130px;
  margin-top: 20px;
  margin-bottom: 50px;
  background-image: url(${(p) => p.background || imageHub.memberImg});
  background-size: cover;
  border: ${(p) => (p.background ? '3px solid #000000' : 'none')};
  border-radius: 50%;
`;
const LoginModalHeadBox = styled.label`
  position: absolute;
  top: -17px;
  right: -17px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 54px;
  height: 54px;
  background-color: #0a5efb;
  border: 4px #fff solid;
  border-radius: 50%;
  background-image: url(${imageHub.pencilImg});
  background-size: contain;
  cursor: pointer;
`;
const LoginModalHeadInput = styled.input`
  display: none;
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
  background-image: url(${imageHub.emailImg});
  background-size: cover;
`;
const LoginModalMailText = styled.div`
  width: 112px;
  margin-right: 20px;
  font-size: 20px;
  color: #797979;
`;
const LoginModalUserEmail = styled.div`
  width: 180px;
  font-size: 20px;
  color: #797979;
`;

const LoginModalMailInput = styled.input`
  height: 30px;
  padding-left: 5px;
  border: 1px solid #79797979;
  border-radius: 5px;
`;
const LoginModalPasswordBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 35px;
  margin-bottom: 20px;
`;
const LoginModalPasswordImg = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  background-image: url(${imageHub.lockImg});
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
  padding-left: 5px;
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
  background-image: url(${imageHub.nicknameImg});
  background-size: cover;
`;
const LoginModalNicknameText = styled.div`
  width: 112px;
  margin-right: 20px;
  font-size: 20px;
  color: #797979;
`;
const LoginModalUserNickname = styled.div`
  width: 180px;
  font-size: 20px;
  color: #797979;
`;
const LoginModalButtonBox = styled.div`
  position: absolute;
  bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function LoginModal({ displayLoginModalHandler, displayRegisterModalHandler }: HomeProps) {
  const regexp = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  const location = useLocation();
  const { isLogin, user } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const LoginHandler = async () => {
    setLoading(true);
    if (!email.current?.value.trim() || regexp.test(email.current?.value.trim()) === false) {
      toast.warning('請輸入正確的email');
    } else if (!password.current?.value.trim() || password.current?.value.trim().length < 6) {
      toast.warning('請輸入至少六位數密碼!(不能輸入空白)');
    } else {
      try {
        await authentication.signIn(email.current?.value, password.current?.value);
        toast.success('登入成功!');
        displayLoginModalHandler(false);
      } catch (e) {
        toast.error('帳號或密碼錯誤!');
      }
    }
    setLoading(false);
  };

  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && loading === false) {
      LoginHandler();
    }
  };

  async function updateHeadImg(newPhoto: File) {
    setLoading(true);
    if (newPhoto === undefined || user.uid === undefined || user.uid === undefined) return;
    try {
      const photoURL = await firestorage.uploadPhotoURL(newPhoto, user.uid);
      if (photoURL === undefined) return;
      await firestore.updatePhotoURL(user.uid, photoURL);
      toast.success('上傳成功!');
    } catch (e) {
      toast.error('上傳失敗!');
    }
    setLoading(false);
  }

  return (
    <div>
      <Modal title={isLogin ? '會員' : '登入'}>
        <LoginModalBack
          onClick={() => {
            if (loading === true) return;
            displayLoginModalHandler(false);
          }}
        >
          ✖
        </LoginModalBack>
        <LoginModalImg background={user.photoURL}>
          {isLogin && user.changePhotoRight ? (
            <LoginModalHeadBox>
              <LoginModalHeadInput
                type="file"
                accept=".jpg,.png.gif"
                onChange={(e) => {
                  if (e.target.files === null || loading === true) return;
                  updateHeadImg(e.target.files[0]);
                }}
              />
            </LoginModalHeadBox>
          ) : (
            ''
          )}
        </LoginModalImg>
        <LoginModalMailbox>
          <LoginModalMailImg />
          <LoginModalMailText>電子郵件:</LoginModalMailText>
          {isLogin ? (
            <LoginModalUserEmail>{user.email}</LoginModalUserEmail>
          ) : (
            <LoginModalMailInput ref={email} value="mason@gmail.com" autoFocus />
          )}
        </LoginModalMailbox>
        {isLogin ? (
          <LoginModalNicknameBox>
            <LoginModalNicknameImg />
            <LoginModalNicknameText>暱稱:</LoginModalNicknameText>
            <LoginModalUserNickname>{user.nickname}</LoginModalUserNickname>
          </LoginModalNicknameBox>
        ) : (
          <LoginModalPasswordBox>
            <LoginModalPasswordImg />
            <LoginModalPasswordText>密碼:</LoginModalPasswordText>
            <LoginModalPasswordInput
              type="password"
              ref={password}
              value="778899"
              onKeyPress={keyDownHandler}
            />
          </LoginModalPasswordBox>
        )}
        {isLogin ? (
          <LoginModalButtonBox>
            {location.pathname === '/' ? (
              <BlueButton
                content="登出"
                loading={loading}
                onClick={() => {
                  setLoading(true);
                  authentication.signOut(user.uid);
                  displayLoginModalHandler(false);
                  setLoading(false);
                }}
              />
            ) : (
              <BlueButton
                content="返回遊戲"
                loading={loading}
                onClick={() => {
                  displayLoginModalHandler(false);
                }}
              />
            )}
          </LoginModalButtonBox>
        ) : (
          <LoginModalButtonBox>
            <BlueButton content="登入" loading={loading} onClick={LoginHandler} />
            <YellowButton
              content="註冊帳號"
              loading={false}
              onClick={() => {
                if (loading === true) return;
                displayLoginModalHandler(false);
                displayRegisterModalHandler(true);
              }}
            />
          </LoginModalButtonBox>
        )}
      </Modal>
    </div>
  );
}

export default LoginModal;
