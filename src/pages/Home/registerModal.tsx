import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import firestore, { authentication } from '../../utils/firestore';
import nicknameImg from '../../img/nickname.png';
import emailImg from '../../img/email.png';
import lockImg from '../../img/lock.png';
import starImg from '../../img/star.png';
import friendsImg from '../../img/friends.png';
import Modal from '../../components/modal';
import BlueButton from '../../components/buttons/blueButton';
import YellowButton from '../../components/buttons/yellowButton';

interface HomeProps {
  displayLoginModalHandler: (display: boolean) => void;
  displayRegisterModalHandler: (display: boolean) => void;
}

const RegisterModalBack = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
`;
const RegisterModalAside = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  height: 100px;
  margin-top: 20px;
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
const RegisterModalStarText = styled.div`
  color: #797979;
`;
const RegisterModalFriends = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${friendsImg});
  background-size: cover;
  margin-bottom: 10px;
`;
const RegisterModalFriendsText = styled.div`
  color: #797979;
`;
const RegisterModalDivider = styled.div`
  width: 300px;
  border-top: 2px solid #c4c5c6;
  margin: 15px 0 25px 0;
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
  padding-left: 5px;
  border: 1px solid #797979;
  border-radius: 5px;
`;
const RegisterModalButtonBox = styled.div`
  position: absolute;
  bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
function RegisterModal({ displayLoginModalHandler, displayRegisterModalHandler }: HomeProps) {
  const regexp = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  const [loading, setLoading] = useState(false);
  const nickname = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const register = async () => {
    setLoading(true);
    if (!nickname.current?.value.trim()) {
      toast.info('請輸入暱稱!');
    } else if (!email.current?.value.trim() || regexp.test(email.current?.value.trim()) === false) {
      toast.info('請輸入合格的email!');
    } else if (!password.current?.value.trim() || password.current?.value.trim().length < 6) {
      toast.info('請輸入至少六位數密碼!(不能輸入空白)');
    } else {
      try {
        const userCredential = await authentication.register(
          email.current?.value,
          password.current?.value,
        );
        if (userCredential?.user.uid === undefined) return;
        await firestore.addUser(
          userCredential?.user.uid,
          nickname.current.value,
          email.current.value,
        );
        await firestore.setNewAccomplishment(userCredential?.user.uid);
        toast.success('註冊成功!');
        displayRegisterModalHandler(false);
        displayLoginModalHandler(true);
      } catch (e) {
        console.log(e);
        toast.error('註冊失敗!');
      }
    }
    setLoading(false);
  };

  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      register();
    }
  };

  return (
    <div>
      <Modal title="註冊">
        <RegisterModalBack
          onClick={() => {
            if (loading === true) return;
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
          <RegisterModalPasswordInput
            ref={nickname}
            maxLength={7}
            placeholder="至多七個字"
            autoFocus
          />
        </RegisterModalPasswordBox>
        <RegisterModalPasswordBox>
          <RegisterModalMailImg />
          <RegisterModalPasswordText>電子郵件:</RegisterModalPasswordText>
          <RegisterModalPasswordInput ref={email} placeholder="合格的email" />
        </RegisterModalPasswordBox>
        <RegisterModalPasswordBox>
          <RegisterModalPasswordImg />
          <RegisterModalPasswordText>密碼:</RegisterModalPasswordText>
          <RegisterModalPasswordInput
            type="password"
            ref={password}
            placeholder="至少六位密碼"
            onKeyDown={keyDownHandler}
          />
        </RegisterModalPasswordBox>
        <RegisterModalButtonBox>
          <BlueButton content="註冊" loading={loading} onClick={register} />
          <YellowButton
            content="登入帳號"
            loading={false}
            onClick={() => {
              if (loading === true) return;
              displayLoginModalHandler(true);
              displayRegisterModalHandler(false);
            }}
          />
        </RegisterModalButtonBox>
      </Modal>
    </div>
  );
}

export default RegisterModal;
