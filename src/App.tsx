import React, { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createGlobalStyle } from 'styled-components';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onSnapshot, doc } from 'firebase/firestore';
import { AuthContext } from './context/authContext';
import firestore, { db, realtime } from './utils/firestore';
import Background from './components/background';
import Navbar from './components/navbar';
import CheckDevice from './components/checkDevice';

const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Noto Sans TC', sans-serif;
  }
  .noScrollbar{
    -ms-overflow-style: none;
  }
  .noScrollbar::-webkit-scrollbar {
    display: none;
  }
`;

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<{
    uid: string;
    nickname: string;
    email: string;
    photoURL: string;
    friends: string[] | undefined;
    changePhotoRight: boolean;
    inviting: { nickname: string; URL: string; photoURL: string } | undefined;
  }>({
    uid: '',
    nickname: '',
    email: '',
    photoURL: '',
    friends: undefined,
    changePhotoRight: false,
    inviting: undefined,
  });

  useEffect(() => {
    async function userHandler(auth: { uid: string } | null) {
      setUser({
        uid: '',
        nickname: '',
        email: '',
        photoURL: '',
        friends: undefined,
        changePhotoRight: false,
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
          changePhotoRight: userData?.changePhotoRight,
          inviting: userData?.inviting,
        });
        setIsLogin(true);
        await firestore.updateUserOnline(auth.uid, true);
        await realtime.setUserIsOnline(auth.uid);
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
    async function userOnlineStateHandler() {
      if (!user.uid) return;
      await firestore.updateUserOnline(user.uid, true);
      await realtime.setUserIsOnline(user.uid);
    }
    document.addEventListener('visibilitychange', userOnlineStateHandler);
    return () => {
      document.removeEventListener('visibilitychange', userOnlineStateHandler);
    };
  }, [user.uid]);

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
        changePhotoRight: userData?.changePhotoRight,
        inviting: userData?.inviting,
      });
    });
    return () => {
      userSubscriber();
    };
  }, [isLogin]);

  const userDate = useMemo(() => ({ isLogin, user }), [isLogin, user]);
  return (
    <div>
      <GlobalStyle />
      <AuthContext.Provider value={userDate}>
        <CheckDevice />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          limit={2}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark"
          transition={Flip}
        />
        <Background />
        <Navbar />
        <Outlet />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
