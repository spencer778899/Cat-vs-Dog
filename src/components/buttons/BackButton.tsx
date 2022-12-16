import React from 'react';
import styled from 'styled-components';

const BackButtonIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
`;

function BackButton({ onClick }: { onClick: () => void }) {
  return <BackButtonIcon onClick={onClick}>✖</BackButtonIcon>;
}

export default BackButton;
