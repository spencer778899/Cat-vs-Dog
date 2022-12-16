import React, { SetStateAction, Dispatch } from 'react';
import styled from 'styled-components';

const CheckBoxWrapper = styled.div`
  position: relative;

  &:hover > #Memo {
    display: block;
  }
`;
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 2px;
  left: 0;
  width: 60px;
  height: 30px;
  padding: 0.5px 0 0.5px 2px;
  border-radius: 20px;
  border: 2px solid #000;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: '關';
    display: block;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    text-align: center;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 20px;
  width: 60px;
  height: 30px;
  padding: 0.5px;
  &:checked + ${CheckBoxLabel} {
    background: #4fbe79;
    &::after {
      content: '開';
      display: block;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      text-align: center;
      margin-left: 28px;
      transition: 0.2s;
    }
  }
`;
const CheckBoxMemo = styled.div`
  display: none;
  position: absolute;
  bottom: -26px;
  width: 80px;
  background-color: #ffffff90;
  text-align: center;
  border-radius: 15px;
`;
function Switch({ setDisplayBullet }: { setDisplayBullet: Dispatch<SetStateAction<boolean>> }) {
  return (
    <CheckBoxWrapper>
      <CheckBox
        id="checkbox"
        type="checkbox"
        defaultChecked
        onClick={() => {
          setDisplayBullet((prev) => !prev);
        }}
      />
      <CheckBoxLabel htmlFor="checkbox" />
      <CheckBoxMemo id="Memo">顯示彈幕</CheckBoxMemo>
    </CheckBoxWrapper>
  );
}

export default Switch;
