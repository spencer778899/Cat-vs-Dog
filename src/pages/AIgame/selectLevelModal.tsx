import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

interface AIgameProps {
  getAILevel: (level: number) => void;
}

const SelectLevelModelBody = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 98;
`;
const SelectLevelModelMain = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 400px;
  height: 400px;
  margin: auto;
  z-index: 99;
  background-color: #ffffff;
`;
const SelectLevelModelButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  margin: 30px 150px;
`;
function Content({ getAILevel }: AIgameProps) {
  return (
    <div>
      <SelectLevelModelBody>
        <SelectLevelModelMain>
          <SelectLevelModelButton
            onClick={() => {
              getAILevel(0.3);
            }}
          >
            Level 1
          </SelectLevelModelButton>
          <SelectLevelModelButton
            onClick={() => {
              getAILevel(0.6);
            }}
          >
            Level 2
          </SelectLevelModelButton>
          <SelectLevelModelButton
            onClick={() => {
              getAILevel(0.9);
            }}
          >
            Level 3
          </SelectLevelModelButton>
        </SelectLevelModelMain>
      </SelectLevelModelBody>
    </div>
  );
}

function SelectLevelModel({ getAILevel }: AIgameProps) {
  return (
    <div>
      {ReactDOM.createPortal(
        <Content getAILevel={getAILevel} />,
        document?.getElementById('modal-root') as HTMLElement,
      )}
    </div>
  );
}

export default SelectLevelModel;
