import React, { useEffect, useRef, useState } from 'react';
import styled, { StyledInterface } from 'styled-components';
import member from '../../img/member.png';
import { GlobalContent, useGlobalContext } from '../../context/authContext';
import firestore from '../../utils/firestore';

interface homeProps {
  invitationList: { uid: string; nickname: string; photoURL: string }[];
}

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
const FriendInviteImg = styled.div<{ img: string }>`
  width: 50px;
  height: 50px;
  margin-right: 17px;
  background-image: url(${(p) => p.img});
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

function Friends({ invitationList }: homeProps) {
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
        console.log(res);
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
  console.log(invitationList);
  async function sendFriendInvitation() {
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

  async function acceptFriendInvitation(id: string) {
    if (user?.friends?.some((uid) => uid === id) && user.email) {
      alert('你們已經是好友了!');
      await firestore.deleteInvitation(user.email, id);
    } else if (user.uid && user.friends && user.email) {
      await firestore.updateFriends(user?.uid, [...user.friends, id]);
      await firestore.deleteInvitation(user.email, id);
      alert('你們成為好友了!');
      const anotherUser = (await firestore.getUser(id)) as { friends: [string] };
      const anotherFriends: [string] = anotherUser.friends;
      anotherFriends.push(user.uid);
      await firestore.updateFriends(id, anotherFriends);
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
        <div>
          {invitationList &&
            invitationList.map((invitation) => (
              <FriendBox key={invitation.uid}>
                <FriendInviteImg img={invitation.photoURL} />
                <FriendTextBox>
                  <FriendName>{invitation.nickname}</FriendName>
                </FriendTextBox>
                <FriendsInviteButton
                  onClick={() => {
                    acceptFriendInvitation(invitation.uid);
                  }}
                >
                  接受
                </FriendsInviteButton>
              </FriendBox>
            ))}
        </div>
      )}
      <FriendInviteBox>
        <FriendIDInput ref={invitationEmail} placeholder="email" />
        <FriendIDSubmit
          onClick={() => {
            sendFriendInvitation();
          }}
        >
          交朋友
        </FriendIDSubmit>
      </FriendInviteBox>
    </FriendsMain>
  );
}

export default Friends;
