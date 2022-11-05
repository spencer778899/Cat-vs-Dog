import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import firestore from '../../utils/firestore';

function OnlineGame() {
  const roomID = useParams;
  useEffect(() => {
    // -
  });
  return <div>Online Game</div>;
}

export default OnlineGame;
