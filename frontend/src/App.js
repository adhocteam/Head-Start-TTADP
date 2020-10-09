import React, { useState, useEffect } from 'react';
import '@trussworks/react-uswds/lib/index.css';
import 'uswds/dist/css/uswds.css';

import { BrowserRouter, Route } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';

import { fetchUser, fetchLogout } from './fetchers/Auth';

import Header from './components/Header';
import Admin from './pages/Admin';
import Unauthenticated from './pages/Unauthenticated';
import Home from './pages/Home';
import UserContext from './UserContext';

import ActivityReport from './pages/ActivityReport';
import './App.css';

function App() {
  const [user, updateUser] = useState();
  const [loading, updateLoading] = useState(true);
  const [loggedOut, updateLoggedOut] = useState(false);
  const authenticated = user !== undefined;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await fetchUser();
        updateUser(u);
      } catch (e) {
        updateUser();
      } finally {
        updateLoading(false);
      }
    };
    fetchData();
  }, []);

  const logout = async () => {
    await fetchLogout();
    updateUser();
    updateLoggedOut(true);
  };

  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const renderAuthenticatedRoutes = () => (
    <>
      <Route Home path="/" component={Home} />
      <Route path="/admin/:userId?" component={Admin} />
      <Route path="/activity-reports" component={ActivityReport} />
    </>
  );

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, authenticated, logout }}>
        <Header authenticated={authenticated} />
        <div className="background-stripe" />
        <section className="usa-section">
          <GridContainer>
            {!authenticated
        && <Unauthenticated loggedOut={loggedOut} />}
            {authenticated
        && renderAuthenticatedRoutes()}
          </GridContainer>
        </section>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
