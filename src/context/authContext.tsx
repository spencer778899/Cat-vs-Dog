import { createContext, useContext } from 'react';

export type GlobalContent = {
  isLogin: boolean;
  user: {
    uid: string | undefined;
    nickname: string | undefined;
    email: string | undefined;
    photoURL: string | undefined;
    friends: string[] | undefined;
    changePhotoRight: boolean | undefined;
    inviting: string | undefined;
  };
};

export const AuthContext = createContext<GlobalContent>({
  isLogin: false,
  user: {
    uid: undefined,
    nickname: undefined,
    email: undefined,
    photoURL: undefined,
    friends: undefined,
    changePhotoRight: undefined,
    inviting: undefined,
  },
});

export const useGlobalContext = () => useContext(AuthContext);
