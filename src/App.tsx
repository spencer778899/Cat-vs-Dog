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
import CheckDevice from './components/checkDevice/checkDevice';

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
    uid: string | undefined;
    nickname: string | undefined;
    email: string | undefined;
    photoURL: string | undefined;
    friends: string[] | undefined;
    changePhotoRight: boolean | undefined;
    inviting: { nickname: string; URL: string; photoURL: string } | undefined;
  }>({
    uid: undefined,
    nickname: undefined,
    email: undefined,
    photoURL: undefined,
    friends: undefined,
    changePhotoRight: undefined,
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
        changePhotoRight: undefined,
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
        await realtime.loginRealtime(auth.uid);
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
        changePhotoRight: userData?.changePhotoRight,
        inviting: userData?.inviting,
      });
    });
    return () => {
      userSubscriber();
    };
  }, [isLogin]);

  const foo = useMemo(() => ({ isLogin, user }), [isLogin, user]);
  return (
    <div>
      <GlobalStyle />
      <AuthContext.Provider value={foo}>
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
