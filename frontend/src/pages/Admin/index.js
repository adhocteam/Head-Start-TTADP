import React from 'react';
import { Switch, Route } from 'react-router';
import { Link } from 'react-router-dom';

import User from './users';
import Cdi from './cdi';
import Diag from './diag';

function Admin() {
  return (
    <>
      <h1>Admin UI</h1>
      <div className="margin-bottom-2">
        <Link className="usa-button" to="/admin/cdi">
          CDI grants
        </Link>
        <Link className="usa-button" to="/admin/users">
          Users
        </Link>
        <Link className="usa-button" to="/admin/diag">
          Diag
        </Link>
      </div>
      <Switch>
        <Route
          path="/admin/cdi/:grantId?"
          render={({ match }) => <Cdi match={match} />}
        />
        <Route
          path="/admin/users/:userId?"
          render={({ match }) => <User match={match} />}
        />
        <Route
          path="/admin/diag/"
          render={({ match }) => <Diag match={match} />}
        />
      </Switch>
    </>
  );
}

export default Admin;
