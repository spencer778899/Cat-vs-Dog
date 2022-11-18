import React from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';

interface Props {
  content: string;
  loading: boolean;
  onClick: () => void;
}

const Wrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 186px;
  height: 40px;
  margin: 0 10px;
  background-color: #13bafe;
  border-top-color: #66cfff;
  border-right-color: #66cfff;
  border-left-color: #66cfff;
  border-bottom-color: #248aed;
  border-radius: 34px;
  box-shadow: 0 0 0 4px #002043, 0 0 0 5px #7c92b0;
  text-align: center;
  cursor: pointer;

  &:hover {
    opacity: 90%;
  }
`;

const WrapperText = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Loading = styled(ReactLoading)`
  position: absolute;
  right: 24px;
  top: 18px;
`;

function BlueButton({ content, loading, onClick }: Props) {
  const handleClick = () => {
    if (loading) return;
    onClick();
  };
  return (
    <Wrapper
      onClick={() => {
        handleClick();
      }}
    >
      <WrapperText>{content}</WrapperText>
      {loading && <Loading type="bars" color="#000" height={24} width={24} />}
    </Wrapper>
  );
}

export default BlueButton;
