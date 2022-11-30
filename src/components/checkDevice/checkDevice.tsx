import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import YellowButton from '../buttons/yellowButton';

const CheckDeviceBody = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #000000c5;
  z-index: 99;
`;
const CheckDeviceMain = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 60%;
  height: 20%;
  margin: auto;
  padding: 4%;
  text-align: center;
  background-color: #ffffff;
  border-radius: 15px;
`;

const CheckDeviceButtonBox = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  bottom: -50px;
  width: 200px;
  margin: auto;
`;

function CheckDevice() {
  const [isCompatibleDevice, setIsCompatibleDevice] = useState(true);

  const backPreviousPage = () => {
    window.history.back();
  };

  useEffect(() => {
    function checkDeviceHandler() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i) ||
        window.innerWidth <= 1124
      ) {
        setIsCompatibleDevice(false);
      } else {
        setIsCompatibleDevice(true);
      }
    }
    checkDeviceHandler();
    window.addEventListener('resize', checkDeviceHandler);
  }, []);

  return (
    <div>
      {
        // prettier-ignore
        isCompatibleDevice ? '' :
          ReactDOM.createPortal(
            <CheckDeviceBody>
              <CheckDeviceMain>
                網頁只支援PC裝置，視窗寬度要求 1124px 以上
                <CheckDeviceButtonBox>
                  {/* <YellowButton content="回上一頁" loading={false} onClick={backPreviousPage} /> */}
                </CheckDeviceButtonBox>
              </CheckDeviceMain>
            </CheckDeviceBody>,
            document?.getElementById('modal-root') as HTMLElement,
          )
      }
    </div>
  );
}

export default CheckDevice;
