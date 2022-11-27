import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/authContext';
import firestore from '../../utils/firestore';
import MinBlueButton from '../buttons/minBlueBottom';
import MinYellowButton from '../buttons/minYellowButton';

interface homeProps {
  invitationList: { uid: string; nickname: string; photoURL: string }[];
}

const FriendsMain = styled.div`
  position: absolute;
  top: 76px;
  left: 88px;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: auto;
  min-height: 250px;
  padding-bottom: 50px;
  border-radius: 10px;
  box-shadow: -2px 2px 4px 0 rgb(0 0 0 / 30%);
  background-color: #ffffff;
  z-index: 10;
`;
const FriendsButtonBox = styled.div`
  display: flex;
  width: 300px;
  height: 35px;
  cursor: pointer;
`;
const FriendsMine = styled.div<{ display: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  border-top-left-radius: 10px;
  background-color: ${(p) => (p.display === 'friends' ? '#ffffff' : '#e0e0e0')};
`;
const FriendsInvite = styled.div<{ display: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  border-top-right-radius: 10px;
  background-color: ${(p) => (p.display === 'friends' ? '#e0e0e0' : '##ffffff')};
`;
const FriendBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 75px;
  padding: 10px;
`;
const FriendImg = styled.div<{ img: string }>`
  width: 50px;
  height: 50px;
  margin-right: 20px;
  border: 0.5px solid #000;
  border-radius: 50%;
  background-image: url(${(p) => p.img});
  background-size: cover;
`;
const FriendInviteImg = styled.div<{ img: string }>`
  width: 50px;
  height: 50px;
  margin-right: 20px;
  border: 0.5px solid #000;
  border-radius: 50%;
  background-image: url(${(p) => p.img});
  background-size: cover;
`;
const FriendTextBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 135px;
  height: 58px;
  margin-right: 15px;
`;
const FriendName = styled.div`
  height: 36px;
  font-size: 24px;
  color: #797979;
  overflow: hidden;
`;
const FriendEmail = styled.div`
  height: 17px;
  font-size: 12px;
  color: #797979;
  overflow: hidden;
`;
const FriendsInviteButton = styled.button`
  width: 60px;
  height: 24px;
  border: 0.5px solid #acacac;
  border-radius: 20px;
  text-align: center;
  background-color: #fff;
  font-weight: 500;
  color: #acacac;
  cursor: pointer;

  &:hover {
    background-color: #d6d6d6;
  }
  &:active {
    background-color: #acacac;
    color: #000;
  }
`;
const FriendInviteBox = styled.div`
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  height: 30px;
  padding: 10px;
`;
const FriendIDInput = styled.input`
  width: 200px;
  height: 30px;
  margin-right: 5px;
  padding: 5px;
  border: 1px solid #797979;
  border-radius: 5px;
  font-size: 18px;
`;

function Friends({ invitationList }: homeProps) {
  const navigate = useNavigate();
  const { user } = useGlobalContext();
  const [showColumn, setShowColumn] = useState('friends');
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState('none');
  const [friends, setFriends] = useState<
    {
      uid: string;
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
          uid: string;
          nickname: string;
          email: string;
          photoURL: string;
        };
        return {
          uid: res?.uid,
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
  const sendFriendInvitation = async () => {
    setLoading(true);
    setLoadingIndex('MinBlueButton1');
    if (invitationEmail?.current?.value.trim() && user.uid && user.nickname && user.photoURL) {
      await firestore.setNewInvitation(
        invitationEmail?.current?.value,
        user.uid,
        user.nickname,
        user.photoURL,
      );
      toast.success(`對 ${invitationEmail?.current?.value} 的好友邀請已送出!`);
      invitationEmail.current.value = '';
    }
    setLoading(false);
    setLoadingIndex('none');
  };

  const acceptFriendInvitation = async (index: string, id: string) => {
    setLoading(true);
    setLoadingIndex(`MinYellowButton${index}`);
    if (user?.friends?.some((uid) => uid === id) && user.email) {
      toast.info('你們已經是好友了!');
      await firestore.deleteInvitation(user.email, id);
    } else if (user.uid && user.friends && user.email) {
      await firestore.updateFriends(user?.uid, [...user.friends, id]);
      await firestore.deleteInvitation(user.email, id);
      toast.success('你們成為好友了!');
      const anotherUser = (await firestore.getUser(id)) as { friends: [string] };
      const anotherFriends: [string] = anotherUser.friends;
      anotherFriends.push(user.uid);
      await firestore.updateFriends(id, anotherFriends);
    }
    setLoading(false);
    setLoadingIndex('none');
  };

  const sendGameInvitation = async (
    index: string,
    id: string,
    friendEmail: string,
    friendNickname: string,
  ) => {
    setLoading(true);
    setLoadingIndex(`MinYellowButton${index}`);
    if (user.nickname === undefined || user.photoURL === undefined) return;
    const newRoomID = await firestore.setDocRoomID();
    await firestore.updateInviting(id, {
      nickname: user?.nickname,
      URL: `/onlinegame/${newRoomID}/guest`,
      photoURL: user?.photoURL,
    });
    navigate(`/onlinegame/${newRoomID}/host/${friendEmail}`);
    toast.success(`對 ${friendNickname} 的PK邀請已送出!`);
    setLoading(false);
    setLoadingIndex('none');
  };

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
          好友邀請
        </FriendsInvite>
      </FriendsButtonBox>
      {showColumn === 'friends' ? (
        <div>
          {friends &&
            friends.map((friend, index) => (
              <FriendBox key={`${friend.email}`}>
                <FriendImg img={friend.photoURL} />
                <FriendTextBox>
                  <FriendName>{friend.nickname}</FriendName>
                  <FriendEmail>{friend.email}</FriendEmail>
                </FriendTextBox>
                <MinYellowButton
                  content="P K"
                  index={`${index}`}
                  loading={loading}
                  loadingIndex={loadingIndex}
                  friend={friend}
                  onClick={sendGameInvitation}
                />
              </FriendBox>
            ))}
        </div>
      ) : (
        <div>
          {invitationList &&
            invitationList.map((invitation, index) => (
              <FriendBox key={invitation.uid}>
                <FriendInviteImg img={invitation.photoURL} />
                <FriendTextBox>
                  <FriendName>{invitation.nickname}</FriendName>
                </FriendTextBox>
                <MinYellowButton
                  content="接受"
                  index={`${index}`}
                  loading={loading}
                  loadingIndex={loadingIndex}
                  friend={invitation}
                  onClick={acceptFriendInvitation}
                />
              </FriendBox>
            ))}
        </div>
      )}
      <FriendInviteBox>
        <FriendIDInput ref={invitationEmail} placeholder="email" />
        <MinBlueButton
          content="交朋友"
          index="1"
          loading={loading}
          loadingIndex={loadingIndex}
          onClick={sendFriendInvitation}
        />
      </FriendInviteBox>
    </FriendsMain>
  );
}

export default Friends;
