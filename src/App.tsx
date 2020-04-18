import { Router } from '@reach/router';
import React from 'react';
import { CreditsScreen, GameScreen, HomeScreen } from './containers';
import { Routes } from './Routes';

function App() {
  return (
    <Router style={{ display: 'flex', height: '100vh' }}>
      <HomeScreen default path={Routes.Home} />
      <GameScreen path={Routes.Game} />
      <CreditsScreen path={Routes.Credits} />
    </Router>
  );
}

export default App;
