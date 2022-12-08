import { createContext, useContext } from 'react';

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
