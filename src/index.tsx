import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import AIGame from './pages/AIGame';
import Home from './pages/Home';
import Game from './pages/Game';
import OnlineGame from './pages/OnlineGame';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="game" element={<Game />} />
          <Route path="AIgame" element={<AIGame />} />
          <Route path="onlinegame" element={<OnlineGame />} />
          <Route path="onlinegame/:roomID" element={<OnlineGame />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>,
);
