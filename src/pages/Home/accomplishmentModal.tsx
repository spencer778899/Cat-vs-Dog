import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/authContext';
import firestore from '../../utils/firestore';
import Modal from '../../components/modal';
import BlueButton from '../../components/buttons/blueButton';
import BackButton from '../../components/buttons/BackButton';
import imageHub from '../../utils/imageHub';

interface HomeProps {
  displayAccomplishmentModalHandler: (display: boolean) => void;
  displayLoginModalHandler: (display: boolean) => void;
}

const AccomplishmentModalBoard = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 15px;
  border-radius: 20px;
  background-color: rgba(159, 189, 201, 0.7);
`;
const Loading = styled(ReactLoading)`
  width: 24px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
`;
const AccomplishmentModalGoal1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(50% - 10px);
  height: calc(50% - 10px);
  padding: 12px;
  border-radius: 15px;
  background-color: #ffffff;
`;
const AccomplishmentModalGoal2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(50% - 10px);
  height: calc(50% - 10px);
  padding: 12px;
  border-radius: 15px;
  background-color: #ffffff;
`;
const AccomplishmentModalGoal1Img = styled.div<{ achieved: boolean | undefined }>`
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
  background-image: url(${(p) => (p.achieved ? imageHub.getFriend1Img : imageHub.getFriend0Img)});
  background-size: cover;
  border-radius: 50%;
  border: 2px #012442 solid;
  box-shadow: 0 0 0 3px #fff, 0 0 0 5px #9fbdc9;
`;
const AccomplishmentModalGoal2Img = styled.div<{ achieved: boolean | undefined }>`
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
  background-image: url(${(p) => (p.achieved ? imageHub.hacker1Img : imageHub.hacker0Img)});
  background-size: cover;
  border-radius: 50%;
  border: 2px #012442 solid;
  box-shadow: 0 0 0 3px #fff, 0 0 0 5px #9fbdc9;
`;
const AccomplishmentModalGoal1Text = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 24px;
  color: #797979;
`;
const AccomplishmentModalGoal2Text = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 24px;
  color: #797979;
`;
const AccomplishmentModalIcon = styled.div`
  width: 25px;
  height: 25px;
  margin-bottom: 5px;
  background-image: url(${imageHub.championImg});
  background-size: cover;
`;
const AccomplishmentModalGoal1Rate = styled.div`
  color: #797979;
`;
const AccomplishmentModalGoal2Rate = styled.div`
  color: #797979;
`;
const AccomplishmentModalLoginBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
function AccomplishmentModal({
  displayAccomplishmentModalHandler,
  displayLoginModalHandler,
}: HomeProps) {
  const { isLogin, user } = useGlobalContext();
  const [accomplishments, setAccomplishments] =
    useState<{ goalName: string; achieved: boolean; progressRate: number }[]>();

  useEffect(() => {
    async function getAccomplishments() {
      if (!isLogin || !user.uid) return;
      const result = await firestore.getAccomplishments(user.uid);
      setAccomplishments(result);
    }
    getAccomplishments();
  }, [isLogin, user]);

  function renderAccomplishmentGoals() {
    return (
      <AccomplishmentModalBoard>
        {accomplishments ? (
          <>
            <AccomplishmentModalGoal1>
              <AccomplishmentModalGoal1Img achieved={accomplishments?.[0].achieved} />
              <AccomplishmentModalGoal1Text>
                {accomplishments?.[0].goalName}
              </AccomplishmentModalGoal1Text>
              <AccomplishmentModalIcon />
              <AccomplishmentModalGoal1Rate>
                {`${accomplishments?.[0].progressRate}/2`}
              </AccomplishmentModalGoal1Rate>
            </AccomplishmentModalGoal1>
            <AccomplishmentModalGoal2>
              <AccomplishmentModalGoal2Img achieved={accomplishments?.[1].achieved} />
              <AccomplishmentModalGoal2Text>
                {accomplishments?.[1].goalName}
              </AccomplishmentModalGoal2Text>
              <AccomplishmentModalIcon />
              <AccomplishmentModalGoal2Rate>{`${accomplishments?.[1].progressRate}/1`}</AccomplishmentModalGoal2Rate>
            </AccomplishmentModalGoal2>
          </>
        ) : (
          <Loading type="bars" color="#000" height={36} width={36} />
        )}
      </AccomplishmentModalBoard>
    );
  }

  return (
    <div>
      <Modal title="成就">
        <>
          <BackButton
            onClick={() => {
              displayAccomplishmentModalHandler(false);
            }}
          />
          {isLogin ? (
            renderAccomplishmentGoals()
          ) : (
            <AccomplishmentModalBoard>
              <AccomplishmentModalLoginBox>
                <BlueButton
                  content="登入"
                  loading={false}
                  onClick={() => {
                    displayAccomplishmentModalHandler(false);
                    displayLoginModalHandler(true);
                  }}
                />
              </AccomplishmentModalLoginBox>
            </AccomplishmentModalBoard>
          )}
        </>
      </Modal>
    </div>
  );
}

export default AccomplishmentModal;
