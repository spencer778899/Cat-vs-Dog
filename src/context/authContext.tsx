import firestore, { db, realtime } from '../utils/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type GlobalContent = {
  isLogin: boolean;
  user: {
    uid: string;
    nickname: string;
    email: string;
    photoURL: string;
    friends: string[] | undefined;
    changePhotoRight: boolean;
    inviting: { nickname: string; URL: string; photoURL: string } | undefined;
  };
};

export const AuthContext = createContext<GlobalContent>({
  isLogin: false,
  user: {
    uid: '',
    nickname: '',
    email: '',
    photoURL: '',
    friends: undefined,
    changePhotoRight: false,
    inviting: undefined,
  },
});

export const useGlobalContext = () => useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
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
    if (!isLogin || !user.uid) return;
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
  }, [isLogin, user.uid]);

  const userDate = useMemo(() => ({ isLogin, user }), [isLogin, user]);

  return <AuthContext.Provider value={userDate}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
