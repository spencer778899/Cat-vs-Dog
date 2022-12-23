import App from './App';
import AIGame from './pages/AIgame';
import Home from './pages/Home';
import Game from './pages/Game';
import OnlineGame from './pages/OnlineGame';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import React from 'react';

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
          <Route path="onlinegame/:roomID/:identity" element={<OnlineGame />} />
          <Route path="onlinegame/:roomID/:identity/:friendEmail" element={<OnlineGame />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </div>,
);
