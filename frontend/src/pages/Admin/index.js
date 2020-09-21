import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import _ from 'lodash';
import {
  GridContainer, Label, TextInput, Grid, SideNav, Button,
} from '@trussworks/react-uswds';
import UserSection from './UserSection';
import NavLink from '../../components/NavLink';

// Fake return from an API
const fetchedUsers = [
  {
    id: 1,
    email: 'dumbledore@hogwarts.com',
    jobTitle: undefined,
    firstName: undefined,
    lastName: undefined,
    permissions: undefined,
    region: undefined,
  },
  {
    id: 2,
    email: 'hermionegranger@hogwarts.com',
    jobTitle: 'Systems Specialist',
    firstName: 'Hermione',
    lastName: 'Granger',
    permissions: [
      {
        region: 0,
        scope: 'SITE_ACCESS',
      },
      {
        region: 1,
        scope: 'READ_WRITE_REPORTS',
      },
    ],
    region: '1',
  },
  {
    id: 3,
    email: 'harrypotter@hogwarts.com',
    jobTitle: 'Grantee Specialist',
    firstName: 'Harry',
    lastName: 'Potter',
    permissions: [
      {
        region: 0,
        scope: 'ADMIN',
      },
      {
        region: 0,
        scope: 'SITE_ACCESS',
      },
      {
        region: 1,
        scope: 'READ_REPORTS',
      },
      {
        region: 1,
        scope: 'READ_WRITE_REPORTS',
      },
      {
        region: 2,
        scope: 'READ_REPORTS',
      },
      {
        region: 3,
        scope: 'READ_REPORTS',
      },
      {
        region: 4,
        scope: 'READ_REPORTS',
      },
      {
        region: 5,
        scope: 'READ_REPORTS',
      },
      {
        region: 6,
        scope: 'READ_REPORTS',
      },
      {
        region: 7,
        scope: 'READ_REPORTS',
      },
      {
        region: 8,
        scope: 'READ_REPORTS',
      },
      {
        region: 9,
        scope: 'READ_REPORTS',
      },
    ],
    region: '4',
  },
  {
    id: 4,
    email: 'ronweasley@hogwarts.com',
    jobTitle: 'Program Specialist',
    firstName: 'Ron',
    lastName: 'Weasley',
    permissions: [
      {
        region: 0,
        scope: 'SITE_ACCESS',
      },
      {
        region: 5,
        scope: 'READ_WRITE_REPORTS',
      },
    ],
    region: '5',
  },
];

/**
 * Render the left hand user navigation in the Admin UI. Use the user's first and last name
 * or email address if the user doesn't have a first name or last name.
 */
function renderUserNav(users) {
  return users.map((user) => {
    const {
      firstName, lastName, email, id,
    } = user;
    let display = email;
    if (firstName) {
      display = `${firstName} ${lastName}`;
    }
    return <NavLink to={`/admin/${id}`}>{display}</NavLink>;
  });
}

/**
 * Admin UI page component. It is split into two main sections, the user list and the
 * user section. The user list can be filtered to make searching for users easier. The
 * user section contains all info on the user that can be updated (first/last name,
 * permissions, etc...). This component handles fetching of users from the API and will
 * be responsible for sending updates/creates back to the API (not yet implemented).
 */
function Admin(props) {
  const { match: { params: { userId } } } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [users, updateUsers] = useState([]);
  const [userSearch, updateUserSearch] = useState('');
  const history = useHistory();

  useEffect(() => {
    // Mock the API call. The setTimeout will be removed once we hit a real API
    setTimeout(() => {
      setIsLoaded(true);
      updateUsers(fetchedUsers);
    }, 400);
  }, []);

  const onUserSearchChange = (e) => {
    updateUserSearch(e.target.value);
  };

  if (!isLoaded) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  let user;
  if (userId === 'new') {
    user = {};
  } else if (userId) {
    user = users.find((u) => (
      u.id === parseInt(userId, 10)
    ));
  }

  const filteredUsers = _.filter(users, (u) => {
    const { email, firstName, lastName } = u;
    return `${email}${firstName}${lastName}`.includes(userSearch);
  });

  return (
    <section className="usa-section">
      <GridContainer>
        <h1 className="text-center">User Administration</h1>
        <Grid row gap>
          <Grid col={4}>
            <Button className="width-full" onClick={() => { history.push('/admin/new'); }}>Create New User</Button>
            <Label htmlFor="input-filter-users">Filter Users</Label>
            <TextInput value={userSearch} onChange={onUserSearchChange} id="input-filter-users" name="input-filter-users" type="text" />
            <div className="overflow-y-scroll maxh-tablet-lg margin-top-3">
              <SideNav items={renderUserNav(filteredUsers)} />
            </div>
          </Grid>
          <Grid col={8}>
            {!user
            && (
              <p className="margin-top-3 text-bold">
                Select a user...
              </p>
            )}
            {user
            && (
              <UserSection user={user} />
            )}
          </Grid>
        </Grid>
      </GridContainer>
    </section>
  );
}

Admin.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default Admin;
