import React from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './context/authContext';
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
  return (
    <div>
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
        <Background />
        <Navbar />
        <Outlet />
      </AuthProvider>
    </div>
  );
}

export default App;
