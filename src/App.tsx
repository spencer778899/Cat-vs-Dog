import AuthProvider from './context/AuthContext';
import Background from './components/background';
import Navbar from './components/navbar';
import CheckDevice from './components/checkDevice';
import { Outlet } from 'react-router-dom';
import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  return (
    <>
      <GlobalStyle />
      <AuthProvider>
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
        <Background>
          <Navbar />
          <Outlet />
        </Background>
      </AuthProvider>
    </>
  );
}

export default App;
