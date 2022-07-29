import React from 'react';
import { MainView } from './views/MainView';
import { DetailView } from './views/DetailView';
import { ProfileView } from './views/ProfileView';
import { Routes, Route } from 'react-router-dom';

function AuthenticatedApp({ route }) {
  const child = route?.routes?.map((r) => ({
    ...r,

    // Commment out following two lines it'll fail to render child routes
    path: `${route.path === '/' ? '' : route.path}${r.path}`,
    exact: r.path === '/',
  }));
  return (
    <Routes>
      <Route path="/" element={<MainView />} />
      <Route path="/detail" element={<DetailView />} />
      <Route path="/profile" element={<ProfileView />} />
    </Routes>
  );
}

export default AuthenticatedApp;
