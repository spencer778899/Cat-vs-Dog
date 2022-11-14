import React from 'react';
import styled from 'styled-components';
import getFriend0Img from '../../img/getFriend0.png';
import getFriend1Img from '../../img/getFriend1.png';
import hacker0 from '../../img/hacker0.png';
import hacker1 from '../../img/hacker1.png';
import championImg from '../../img/champion.png';
import { useGlobalContext } from '../../context/authContext';

interface HomeProps {
  displayAccomplishmentModalHandler: (display: boolean) => void;
  displayLoginModalHandler: (display: boolean) => void;
}

const AccomplishmentModalBody = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(1, 22, 46, 0.68);
  z-index: 98;
`;
const AccomplishmentModalBack = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;
const AccomplishmentModalMain = styled.div`
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
  padding: 50px 20px 20px 20px;
  border: 1px solid #000000;
  border-radius: 20px;
  background-color: #ffffff;
  z-index: 99;
`;
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
const AccomplishmentModalGoal1 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(50% - 10px);
  height: calc(50% - 10px);
  padding: 10px;
  border-radius: 15px;
  background-color: #ffffff;
`;
const AccomplishmentModalGoal2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(50% - 10px);
  height: calc(50% - 10px);
  padding: 10px;
  border-radius: 15px;
  background-color: #ffffff;
`;
const AccomplishmentModalGoal1Img = styled.div`
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
  background-image: url(${getFriend1Img});
  background-size: cover;
  border-radius: 50%;
  border: 2px #012442 solid;
  box-shadow: 0 0 0 3px #fff, 0 0 0 5px #9fbdc9;
`;
const AccomplishmentModalGoal2Img = styled.div`
  width: 50px;
  height: 50px;
  margin-bottom: 20px;
  background-image: url(${hacker1});
  background-size: cover;
  border-radius: 50%;
  border: 2px #012442 solid;
  box-shadow: 0 0 0 3px #fff, 0 0 0 5px #9fbdc9;
`;
const AccomplishmentModalGoal1Text = styled.div`
  margin-bottom: 10px;
  font-size: 18px;
  line-height: 24px;
  color: #797979;
`;
const AccomplishmentModalGoal2Text = styled.div`
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 24px;
  color: #797979;
`;
const AccomplishmentModalIcon = styled.div`
  width: 25px;
  height: 25px;
  margin-bottom: 10px;
  background-image: url(${championImg});
  background-size: cover;
`;
const AccomplishmentModalGoal1Rate = styled.div`
  color: #797979;
`;
const AccomplishmentModalGoal2Rate = styled.div`
  color: #797979;
`;
const AccomplishmentModalLogin = styled.button``;
function AccomplishmentModal({
  displayAccomplishmentModalHandler,
  displayLoginModalHandler,
}: HomeProps) {
  const { isLogin, user } = useGlobalContext();

  return (
    <div>
      <AccomplishmentModalBody>
        <AccomplishmentModalMain>
          <AccomplishmentModalBack
            onClick={() => {
              displayAccomplishmentModalHandler(false);
            }}
          >
            ✖
          </AccomplishmentModalBack>
          {isLogin ? (
            <AccomplishmentModalBoard>
              <AccomplishmentModalGoal1>
                <AccomplishmentModalGoal1Img />
                <AccomplishmentModalGoal1Text>結交兩個好友</AccomplishmentModalGoal1Text>
                <AccomplishmentModalIcon />
                <AccomplishmentModalGoal1Rate>0/2</AccomplishmentModalGoal1Rate>
              </AccomplishmentModalGoal1>
              <AccomplishmentModalGoal2>
                <AccomplishmentModalGoal2Img />
                <AccomplishmentModalGoal2Text>
                  在「對戰AI中」擊敗Level3
                </AccomplishmentModalGoal2Text>
                <AccomplishmentModalIcon />
                <AccomplishmentModalGoal2Rate>0/1</AccomplishmentModalGoal2Rate>
              </AccomplishmentModalGoal2>
            </AccomplishmentModalBoard>
          ) : (
            <div>
              <div>會員專屬功能</div>
              <AccomplishmentModalLogin
                onClick={() => {
                  displayAccomplishmentModalHandler(false);
                  displayLoginModalHandler(true);
                }}
              >
                登入
              </AccomplishmentModalLogin>
            </div>
          )}
        </AccomplishmentModalMain>
      </AccomplishmentModalBody>
    </div>
  );
}

export default AccomplishmentModal;
