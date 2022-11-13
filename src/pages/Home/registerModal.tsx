import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import firestore, { authentication } from '../../utils/firestore';
import nicknameImg from '../../img/nickname.png';
import emailImg from '../../img/email.png';
import lockImg from '../../img/lock.png';
import starImg from '../../img/star.png';
import friendsImg from '../../img/friends.png';

interface HomeProps {
  displayLoginModalHandler: (display: boolean) => void;
  displayRegisterModalHandler: (display: boolean) => void;
}

const RegisterModalBody = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 22, 46, 0.68);
  z-index: 98;
`;
const RegisterModalBack = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;
const RegisterModalMain = styled.div`
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
  padding: 70px 20px 20px 20px;
  border: 1px solid #000000;
  border-radius: 20px;
  background-color: #ffffff;
  z-index: 99;
`;
const RegisterModalAside = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  height: 100px;
`;
const RegisterModalImgBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const RegisterModalStar = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${starImg});
  background-size: cover;
  margin-bottom: 10px;
`;
const RegisterModalStarText = styled.div``;
const RegisterModalFriends = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${friendsImg});
  background-size: cover;
  margin-bottom: 10px;
`;
const RegisterModalFriendsText = styled.div``;
const RegisterModalDivider = styled.div`
  width: 300px;
  border-top: 2px solid #c4c5c6;
  margin: 30px 0;
`;
const RegisterModalPasswordBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 35px;
  margin-bottom: 20px;
`;
const RegisterModalPasswordImg = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  background-image: url(${lockImg});
  background-size: cover;
`;
const RegisterModalNicknameImg = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  background-image: url(${nicknameImg});
  background-size: cover;
`;
const RegisterModalMailImg = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  background-image: url(${emailImg});
  background-size: cover;
`;
const RegisterModalPasswordText = styled.div`
  width: 112px;
  margin-right: 20px;
  font-size: 20px;
  color: #797979;
`;
const RegisterModalPasswordInput = styled.input`
  height: 30px;
  border: 1px solid #797979;
  border-radius: 5px;
`;
const RegisterModalRegister = styled.button`
  width: 186px;
  height: 40px;
  border-radius: 24px;
  cursor: pointer;
`;
function RegisterModal({ displayLoginModalHandler, displayRegisterModalHandler }: HomeProps) {
  const regexp = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  const [loading, setLoading] = useState(false);
  const nickname = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  async function register() {
    setLoading(true);
    if (!email.current?.value.trim() || regexp.test(email.current?.value.trim()) === false) {
      alert('請輸入合格的email!');
    } else if (!password.current?.value.trim() || password.current?.value.trim().length < 6) {
      alert('請輸入至少六位數密碼!(不能輸入空白)');
    } else if (!nickname.current?.value.trim()) {
      alert('請輸入暱稱!');
    } else {
      const userCredential = await authentication.register(
        email.current?.value,
        password.current?.value,
      );
      await firestore.addUser(
        userCredential?.user.uid,
        nickname.current.value,
        email.current.value,
      );
      nickname.current.value = '';
      email.current.value = '';
      password.current.value = '';
      displayRegisterModalHandler(false);
    }
    setLoading(false);
  }

  return (
    <div>
      <RegisterModalBody>
        <RegisterModalMain>
          <RegisterModalBack
            onClick={() => {
              displayLoginModalHandler(true);
              displayRegisterModalHandler(false);
            }}
          >
            ✖
          </RegisterModalBack>
          <RegisterModalAside>
            <RegisterModalImgBox>
              <RegisterModalStar />
              <RegisterModalStarText>成就系統</RegisterModalStarText>
            </RegisterModalImgBox>
            <RegisterModalImgBox>
              <RegisterModalFriends />
              <RegisterModalFriendsText>好友系統</RegisterModalFriendsText>
            </RegisterModalImgBox>
          </RegisterModalAside>
          <RegisterModalDivider />
          <RegisterModalPasswordBox>
            <RegisterModalNicknameImg />
            <RegisterModalPasswordText>暱稱:</RegisterModalPasswordText>
            <RegisterModalPasswordInput ref={nickname} />
          </RegisterModalPasswordBox>
          <RegisterModalPasswordBox>
            <RegisterModalMailImg />
            <RegisterModalPasswordText>電子郵件:</RegisterModalPasswordText>
            <RegisterModalPasswordInput ref={email} placeholder="合格的email" />
          </RegisterModalPasswordBox>
          <RegisterModalPasswordBox>
            <RegisterModalPasswordImg />
            <RegisterModalPasswordText>密碼:</RegisterModalPasswordText>
            <RegisterModalPasswordInput type="password" ref={password} placeholder="至少六位密碼" />
          </RegisterModalPasswordBox>
          <RegisterModalRegister
            onClick={() => {
              if (loading === false) {
                register();
              }
            }}
          >
            註冊
          </RegisterModalRegister>
        </RegisterModalMain>
      </RegisterModalBody>
    </div>
  );
}

export default RegisterModal;
