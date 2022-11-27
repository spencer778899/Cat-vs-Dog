import React from 'react';
import styled from 'styled-components';
import ReactLoading from 'react-loading';

interface Props {
  content: string;
  index: string;
  loading: boolean;
  loadingIndex: string;
  friend: {
    uid: string;
    nickname: string;
    email?: string;
    photoURL: string;
  };
  onClick:
    | ((index: string, id: string) => void)
    | ((index: string, id: string, friendEmail: string, friendNickname: string) => void);
}

const Wrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 60px;
  height: 25px;
  background-color: #ffbf00;
  border-top-color: #ffe100;
  border-right-color: #ffe100;
  border-left-color: #ffe100;
  border-bottom-color: #f88700;
  border-radius: 34px;
  box-shadow: 0 0 0 2px #002043, 0 0 0 2.5px #7c92b0;
  text-align: center;
  cursor: pointer;

  &:hover {
    background-color: #ffcb00;
    border-top-color: #ffef7c;
    border-bottom-color: #f88700;
  }
`;

const WrapperText = styled.div`
  font-size: 14px;
  font-weight: 400;
`;

const Loading = styled(ReactLoading)`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 24px;
  margin: auto;
`;

function MinYellowButton({ content, index, loading, loadingIndex, friend, onClick }: Props) {
  const handleClick = () => {
    if (!loading && friend.email) {
      onClick(`${index}`, friend.uid, friend.email, friend.email);
    }
    if (!loading && friend.uid) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onClick(index, friend.uid);
    }
  };
  return (
    <Wrapper
      onClick={() => {
        handleClick();
      }}
    >
      <WrapperText>
        {loading && `MinYellowButton${index}` === loadingIndex ? '' : content}
      </WrapperText>
      {loading && `MinYellowButton${index}` === loadingIndex && (
        <Loading type="bars" color="#000" height={24} width={24} />
      )}
    </Wrapper>
  );
}

export default MinYellowButton;
