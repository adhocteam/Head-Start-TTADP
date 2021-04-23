/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
// eslint-disable-next-line import/no-extraneous-dependencies
import simpleRestProvider from 'ra-data-simple-rest';
import jsonServerProvider from 'ra-data-json-server';
import {
  Grid, SideNav, Alert, Checkbox, Label, TextInput,
} from '@trussworks/react-uswds';
import dp from './dataProvider';

// import ReactRouterPropTypes from 'react-router-prop-types';

import NavLink from '../../components/NavLink';
import Container from '../../components/Container';
import { DECIMAL_BASE } from '../../Constants';

// import Grant from './components/Grant';

const dataProvider = simpleRestProvider('http://localhost:8080/api/admin');
// const dataProvider = jsonServerProvider('http://localhost:8080/api/admin');

function RequestErrors() {
  // const [selectedGrant, updateSelectedGrant] = useState();
  // const [grantees, updateGrantees] = useState([]);
  // const [requestRequestErrors, updateRequestRequestErrors] = useState([]);
  const [loaded, updateLoaded] = useState(true);
  // const [error, updateError] = useState(false);
  // const [unassigned, updateUnassigned] = useState(false);
  // const [grantSearch, updateGrantSearch] = useState('');
  // const [active, updateActive] = useState(true);

  // useEffect(() => {
  //   async function fetchGrants() {
  //     updateLoaded(false);
  //     try {
  //       const [fetchedGrants, fetchedGrantees] = await Promise.all([
  //         getCDIGrants(unassigned, active),
  //         getGrantees(),
  //       ]);
  //       const [requestRequestErrors, updateRequestRequestErrors] = useState([]);

  //       updateGrants(fetchedGrants);
  //       updateGrantees(fetchedGrantees);
  //     } catch (e) {
  //       // eslint-disable-next-line no-console
  //       console.log(e);
  //       updateError('Unable to fetch grants or grantees');
  //     }
  //     updateLoaded(true);
  //   }
  //   fetchGrants();
  // }, [unassigned, active]);

  // useEffect(() => {
  //   if (grantId) {
  //     updateSelectedGrant(grants.find((g) => (
  //       g.id === parseInt(grantId, DECIMAL_BASE)
  //     )));
  //   }
  // }, [grantId, grants]);

  // const onGrantSearchChange = (e) => {
  //   updateGrantSearch(e.target.value);
  // };

  // const filteredGrants = grants.filter((g) => g.number.toLowerCase().includes(
  //   grantSearch.toLowerCase(),
  // ));

  // const renderGrants = () => filteredGrants.map(({ id, number }) => (
  //   <NavLink to={`/admin/cdi/${id}`}>{`${number} - ${id}`}</NavLink>
  // ));

  // const onAssignCDIGrant = async (selectedGrantId, regionId, granteeId) => {
  //   const grant = await assignCDIGrant(selectedGrantId, regionId, granteeId);
  //   const newGrants = [...grants];
  //   const newGrantIndex = newGrants.findIndex((g) => g.id === grant.id);
  //   newGrants[newGrantIndex] = grant;
  //   updateGrants(newGrants);
  // };

  if (!loaded) {
    return (
      <div>
        loading...
      </div>
    );
  }

  return (
    <>
      <Container>
        <Grid row gap>
          <Grid col={4}>
            <h2>Request Errors</h2>
          </Grid>
          <Grid col={12}>
            <Admin dataProvider={dp}>
              <Resource name="requestErrors" list={ListGuesser} />
            </Admin>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

RequestErrors.propTypes = {
  // match: ReactRouterPropTypes.match.isRequired,
};

export default RequestErrors;
