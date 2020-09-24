import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import UserContext from '../../UserContext';

function Home() {
  return (
    <Switch>
      <Route exact path="/">
        <UserContext.Consumer>
          {({ user, logout }) => (
            <>
              <h1>
                Welcome to the TTA Smart Hub
                {' '}
                {user.name}
              </h1>
              <Button onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </UserContext.Consumer>
      </Route>
      <Route path="/second">
        <div>
          Hello second Page!
        </div>
      </Route>
    </Switch>
  );
}

export default Home;
