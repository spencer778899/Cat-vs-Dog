import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import styled, { createGlobalStyle } from 'styled-components';
import { onSnapshot, doc } from 'firebase/firestore';
import { AuthContext } from './context/authContext';
import firestore, { db } from './utils/firestore';
import Background from './components/background';
import Navbar from './components/navbar';

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;
function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<{
    uid: string | undefined;
    nickname: string | undefined;
    email: string | undefined;
    photoURL: string | undefined;
    friends: [] | undefined;
    inviting: string | undefined;
  }>({
    uid: undefined,
    nickname: undefined,
    email: undefined,
    photoURL: undefined,
    friends: undefined,
    inviting: undefined,
  });

  useEffect(() => {
    async function userHandler(auth: { uid: string } | null) {
      setUser({
        uid: undefined,
        nickname: undefined,
        email: undefined,
        photoURL: undefined,
        friends: undefined,
        inviting: undefined,
      });
      if (auth) {
        const userData = await firestore.getUser(auth.uid);
        setUser({
          uid: userData?.uid,
          nickname: userData?.nickname,
          email: userData?.email,
          photoURL: userData?.photoURL,
          friends: userData?.friends,
          inviting: userData?.inviting,
        });
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    }
    onAuthStateChanged(getAuth(), userHandler);
    return () => {
      onAuthStateChanged(getAuth(), userHandler);
    };
  }, [isLogin]);

  useEffect(() => {
    if (isLogin === false) return;
    const userSubscriber = onSnapshot(doc(db, 'users', `${user.uid}`), (docs) => {
      const userData = docs.data();
      setUser({
        uid: userData?.uid,
        nickname: userData?.nickname,
        email: userData?.email,
        photoURL: userData?.photoURL,
        friends: userData?.friends,
        inviting: userData?.inviting,
      });
    });
    return () => {
      userSubscriber();
    };
  }, [isLogin]);

  const foo = useMemo(() => ({ isLogin, user }), [isLogin, user]);
  return (
    <>
      <GlobalStyle />
      <AuthContext.Provider value={foo}>
        <Background />
        <Navbar />
        <Outlet />
      </AuthContext.Provider>
    </>
  );
}

export default App;
