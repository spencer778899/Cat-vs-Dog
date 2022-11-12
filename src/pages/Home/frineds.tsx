import React, { useEffect, useRef, useState } from 'react';
import styled, { StyledInterface } from 'styled-components';
import member from '../../img/member.png';
import { GlobalContent, useGlobalContext } from '../../context/authContext';
import firestore from '../../utils/firestore';

const FriendsMain = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 250px;
  height: 560px;
  top: 80px;
  left: 30px;
  padding: 10px 0 0 0;
  border-radius: 10px;
  box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  background-color: #ffffff;
`;
const FriendsButtonBox = styled.div`
  display: flex;
  width: 250px;
  height: 35px;
`;
const FriendsMine = styled.div<{ display: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 125px;
  margin-top: -10px;
  border-top-left-radius: 10px;
  background-color: ${(p) => (p.display === 'friends' ? '#ffffff' : '#e0e0e0')};
`;
const FriendsInvite = styled.div<{ display: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 125px;
  margin-top: -10px;
  border-top-right-radius: 10px;
  background-color: ${(p) => (p.display === 'friends' ? '#e0e0e0' : '##ffffff')};
`;
const FriendBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 75px;
  padding: 10px;
`;
const FriendImg = styled.div<{ img: string }>`
  width: 50px;
  height: 50px;
  margin-right: 17px;
  background-image: url(${(p) => p.img});
  background-size: cover;
`;
const FriendInviteImg = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 17px;
  background-image: url(${member});
  background-size: cover;
`;
const FriendTextBox = styled.div`
  margin-right: 15px;
`;
const FriendName = styled.div`
  font-size: 24px;
  color: #797979;
`;
const FriendEmail = styled.div`
  margin-top: 5px;
  font-size: 12px;
  color: #797979;
`;
const FriendsBattleButton = styled.button`
  float: right;
`;
const FriendsInviteButton = styled.button`
  float: right;
`;
const FriendInviteBox = styled.div`
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 240px;
  height: 30px;
  padding: 10px;
`;
const FriendIDInput = styled.input`
  width: 160px;
  height: 30px;
  padding: 5px;
  border: 1px solid #797979;
  border-radius: 5px;
  font-size: 18px;
`;
const FriendIDSubmit = styled.button``;

function Friends() {
  const { isLogin, user } = useGlobalContext();
  const [showColumn, setShowColumn] = useState('friends');
  const [friends, setFriends] = useState<
    {
      nickname: string;
      email: string;
      photoURL: string;
    }[]
  >([]);
  const invitationEmail = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getFriendsData() {
      setFriends([]);
      const result = user.friends?.map(async (uid) => {
        const res = (await firestore.getUser(uid)) as {
          nickname: string;
          email: string;
          photoURL: string;
        };
        return {
          nickname: res?.nickname,
          email: res?.email,
          photoURL: res?.photoURL,
        };
      });
      if (!result) return;
      const newList = await Promise.all(result);
      setFriends(newList);
    }
    getFriendsData();
  }, [user.friends]);

  async function sendFriendIvbitation() {
    if (invitationEmail?.current?.value.trim() && user.uid && user.nickname && user.photoURL) {
      await firestore.setNewInvitation(
        invitationEmail?.current?.value,
        user.uid,
        user.nickname,
        user.photoURL,
      );
      alert('已送出邀請!');
      invitationEmail.current.value = '';
    }
  }

  return (
    <FriendsMain>
      <FriendsButtonBox>
        <FriendsMine
          display={showColumn}
          onClick={() => {
            setShowColumn('friends');
          }}
        >
          好友
        </FriendsMine>
        <FriendsInvite
          display={showColumn}
          onClick={() => {
            setShowColumn('invitation');
          }}
        >
          邀請
        </FriendsInvite>
      </FriendsButtonBox>
      {showColumn === 'friends' ? (
        <div>
          {friends &&
            friends.map((friend) => (
              <FriendBox key={`${friend.email}`}>
                <FriendImg img={friend.photoURL} />
                <FriendTextBox>
                  <FriendName>{friend.nickname}</FriendName>
                  <FriendEmail>{friend.email}</FriendEmail>
                </FriendTextBox>
                <FriendsBattleButton>邀請</FriendsBattleButton>
              </FriendBox>
            ))}
        </div>
      ) : (
        <FriendBox>
          <FriendInviteImg />
          <FriendTextBox>
            <FriendName>Nike</FriendName>
            <FriendEmail>nike@gmail.com</FriendEmail>
          </FriendTextBox>
          <FriendsInviteButton>接受</FriendsInviteButton>
        </FriendBox>
      )}
      <FriendInviteBox>
        <FriendIDInput ref={invitationEmail} placeholder="email" />
        <FriendIDSubmit
          onClick={() => {
            sendFriendIvbitation();
          }}
        >
          交朋友
        </FriendIDSubmit>
      </FriendInviteBox>
    </FriendsMain>
  );
}

export default Friends;
