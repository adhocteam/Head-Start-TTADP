import React from 'react';
import {
  Admin, Resource,
} from 'react-admin';
import dp from './dataProvider';
import RequestErrors, { RequestErrorShow } from './requestErrors';
import Container from '../../components/Container';

function Diag() {
  return (
    <>
      <Container>
        <Admin dataProvider={dp}>
          <Resource name="requestErrors" list={RequestErrors} edit={RequestErrorShow} />
        </Admin>
      </Container>
    </>
  );
}
export default Diag;
