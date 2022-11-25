import React from 'react';
import styled from 'styled-components';

const UserInformationBoxBody = styled.div`
  margin: 0 10px;
`;
const UserInformationBoxMain = styled.div`
  display: flex;
  align-items: center;
  width: 200px;
  height: 60px;
  padding: 5px 0 5px 10px;
  border-radius: 15px;
  background-color: #fff;
  opacity: 50%;
`;
const UserInformationBoxImg = styled.div<{ photoURL: string }>`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border: 0.5px solid #000;
  border-radius: 50%;
  background-image: url(${(p) => p.photoURL});
  background-size: cover;
`;
const UserInformationBoxTexts = styled.div`
  width: 135px;
`;
const UserInformationBoxName = styled.div`
  font-size: 20px;
  overflow: hidden;
`;
const UserInformationBoxEmail = styled.div`
  font-size: 12px;
  overflow: hidden;
`;

function UserInformationBox({
  photoURL,
  name,
  email,
}: {
  photoURL: string | undefined;
  name: string | undefined;
  email: string | undefined;
}) {
  return (
    <UserInformationBoxBody>
      <UserInformationBoxMain>
        <UserInformationBoxImg
          photoURL={
            photoURL ||
            'https://firebasestorage.googleapis.com/v0/b/cat-vs-dog-738e6.appspot.com/o/photos%2F9v2is0Mb9HS0r8kRiVRqPZKwawI2?alt=media&token=0f033cb8-b8d5-4c9e-94e5-3a57bf7fc72a'
          }
        />
        <UserInformationBoxTexts>
          <UserInformationBoxName>{name || '訪客'}</UserInformationBoxName>
          <UserInformationBoxEmail>{email || ''}</UserInformationBoxEmail>
        </UserInformationBoxTexts>
      </UserInformationBoxMain>
    </UserInformationBoxBody>
  );
}

export default UserInformationBox;
