import firestore, { authentication } from '../../utils/firestore';
import imageHub from '../../utils/imageHub';
import Modal from '../../components/modal';
import BlueButton from '../../components/buttons/blueButton';
import YellowButton from '../../components/buttons/yellowButton';
import BackButton from '../../components/buttons/backButton';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import React, { useRef, useState } from 'react';

const RegisterModalAside = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 200px;
  height: 130px;
`;
const RegisterModalAsideTile = styled.div`
  width: 100%;
  margin-bottom: 10px;
  font-size: 18px;
  color: #0257bc;
  text-align: center;
`;
const RegisterModalImgBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
`;
const RegisterModalStar = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${imageHub.starImg});
  background-size: cover;
  margin-bottom: 10px;
`;
const RegisterModalStarText = styled.div`
  color: #797979;
`;
const RegisterModalFriends = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${imageHub.friendsImg});
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
  background-image: url(${imageHub.lockImg});
  background-size: cover;
`;
const RegisterModalNicknameImg = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  background-image: url(${imageHub.nicknameImg});
  background-size: cover;
`;
const RegisterModalMailImg = styled.div`
  width: 25px;
  height: 25px;
  margin-right: 10px;
  background-image: url(${imageHub.emailImg});
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
function RegisterModal({
  setShowModal,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<string>>;
}) {
  const regexp = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
  const [loading, setLoading] = useState(false);
  const nickname = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  const register = async () => {
    setLoading(true);
    if (!nickname.current?.value.trim()) {
      toast.info('???????????????!');
      setLoading(false);
      return;
    }
    if (!email.current?.value.trim() || regexp.test(email.current?.value.trim()) === false) {
      toast.info('??????????????????email!');
      setLoading(false);
      return;
    }
    if (!password.current?.value.trim() || password.current?.value.trim().length < 6) {
      toast.info('??????????????????????????????!(??????????????????)');
      setLoading(false);
      return;
    }
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
      toast.success('????????????!');
      setShowModal('none');
    } catch (e) {
      toast.error('????????????!');
    }
    setLoading(false);
  };

  const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && loading === false) {
      register();
    }
  };

  return (
    <div>
      <Modal title="??????">
        <BackButton
          onClick={() => {
            setShowModal('none');
          }}
        />
        <RegisterModalAside>
          <RegisterModalAsideTile>??????????????????</RegisterModalAsideTile>
          <RegisterModalImgBox>
            <RegisterModalStar />
            <RegisterModalStarText>????????????</RegisterModalStarText>
          </RegisterModalImgBox>
          <RegisterModalImgBox>
            <RegisterModalFriends />
            <RegisterModalFriendsText>????????????</RegisterModalFriendsText>
          </RegisterModalImgBox>
        </RegisterModalAside>
        <RegisterModalDivider />
        <RegisterModalPasswordBox>
          <RegisterModalNicknameImg />
          <RegisterModalPasswordText>??????:</RegisterModalPasswordText>
          <RegisterModalPasswordInput
            ref={nickname}
            maxLength={7}
            placeholder="???????????????"
            autoFocus
          />
        </RegisterModalPasswordBox>
        <RegisterModalPasswordBox>
          <RegisterModalMailImg />
          <RegisterModalPasswordText>????????????:</RegisterModalPasswordText>
          <RegisterModalPasswordInput ref={email} placeholder="?????????email" />
        </RegisterModalPasswordBox>
        <RegisterModalPasswordBox>
          <RegisterModalPasswordImg />
          <RegisterModalPasswordText>??????:</RegisterModalPasswordText>
          <RegisterModalPasswordInput
            type="password"
            ref={password}
            placeholder="??????????????????"
            onKeyPress={keyDownHandler}
          />
        </RegisterModalPasswordBox>
        <RegisterModalButtonBox>
          <BlueButton content="??????" loading={loading} onClick={register} />
          <YellowButton
            content="????????????"
            loading={false}
            onClick={() => {
              setShowModal('loginModal');
            }}
          />
        </RegisterModalButtonBox>
      </Modal>
    </div>
  );
}

export default RegisterModal;
