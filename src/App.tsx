import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import styled, { createGlobalStyle } from 'styled-components';
import { AuthContext } from './context/authContext';
import firestore from './utils/firestore';
import img from './img/globalBackground.jpg';

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;
const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(${img});
  opacity: 45%;
  z-index: -99;
`;
function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<{
    uid: string | undefined;
    nickname: string | undefined;
    email: string | undefined;
    friends: [] | undefined;
  }>({
    uid: undefined,
    nickname: undefined,
    email: undefined,
    friends: undefined,
  });
  useEffect(() => {
    const userHandler = async (auth: { uid: string } | null) => {
      setUser({
        uid: undefined,
        nickname: undefined,
        email: undefined,
        friends: undefined,
      });
      if (auth) {
        const userData = await firestore.getUser(auth.uid);
        setUser({
          uid: userData?.uid,
          nickname: userData?.nickname,
          email: userData?.email,
          friends: userData?.friends,
        });
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    };
    onAuthStateChanged(getAuth(), userHandler);
    return () => {
      onAuthStateChanged(getAuth(), userHandler);
    };
  }, [isLogin]);
  const foo = useMemo(() => ({ isLogin, user }), [isLogin, user]);
  return (
    <>
      <GlobalStyle />
      <AuthContext.Provider value={foo}>
        <Background />
        <Outlet />
      </AuthContext.Provider>
    </>
  );
}

export default App;
