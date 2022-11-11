import { createContext, useContext } from 'react';

export type GlobalContent = {
  isLogin: boolean;
  user: {
    uid: string | undefined;
    nickname: string | undefined;
    email: string | undefined;
    friends: [] | undefined;
  };
};

export const AuthContext = createContext<GlobalContent>({
  isLogin: false,
  user: {
    uid: undefined,
    nickname: undefined,
    email: undefined,
    friends: undefined,
  },
});

export const useGlobalContext = () => useContext(AuthContext);
