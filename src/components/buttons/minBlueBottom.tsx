import React from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';

interface Props {
  content: string;
  index: string;
  loading: boolean;
  loadingIndex: string;
  onClick: () => void;
}

const Wrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 60px;
  height: 25px;
  background-color: #13bafe;
  border-top-color: #66cfff;
  border-right-color: #66cfff;
  border-left-color: #66cfff;
  border-bottom-color: #248aed;
  border-radius: 34px;
  box-shadow: 0 0 0 2px #002043, 0 0 0 2.5px #7c92b0;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #3fc8ff;
    border-top-color: #b1fdff;
    border-bottom-color: #006ad0;
  }
`;

const WrapperText = styled.div`
  font-size: 14px;
  font-weight: 400;
`;

const Loading = styled(ReactLoading)`
  width: 24px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
`;

function MinBlueButton({ content, index, loading, loadingIndex, onClick }: Props) {
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
      <WrapperText>
        {loading && `MinBlueButton${index}` === loadingIndex ? '' : content}
      </WrapperText>
      {loading && `MinBlueButton${index}` === loadingIndex && (
        <Loading type="bars" color="#000" height={24} width={24} />
      )}
    </Wrapper>
  );
}

export default MinBlueButton;
