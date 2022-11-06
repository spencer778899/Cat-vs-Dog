import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import firestore from '../../utils/firestore';

function OnlineGame() {
  const navigate = useNavigate();
  const urlParams = useParams();
  // If room isn't exist,create a new one
  useEffect(() => {
    async function createNewRoom() {
      if (!urlParams.roomID) {
        const roomID = await firestore.setDocRoomID();
        navigate(`/onlinegame/${roomID}`);
      }
    }
    createNewRoom();
  });
  return <div>Online Game</div>;
}

export default OnlineGame;
