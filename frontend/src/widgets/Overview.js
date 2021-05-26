import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@trussworks/react-uswds';
import withWidgetData from './withWidgetData';
import Container from '../components/Container';
import './Overview.css';

function Field({ label, data, col }) {
  return (
    <Grid col={col} className="smart-hub--overview-nowrap">
      <span className="text-bold">{data}</span>
      <br />
      {label}
    </Grid>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  col: PropTypes.number,
};

Field.defaultProps = {
  col: 2,
};

/*
  Widgets only have to worry about presenting data. Filtering of the data happens at a
  higher level, which is why this component is wrapped with `withWidgetData`. `withWidgetData`
  takes care of fetching data, flagging the component as loading and handling errors while
  fetching data. Widgets are only rendered after data has been successfully loaded from the
  API. Note the `example` passed as a 2nd parameter to `withWidgetData` must match the widget
  id in the backend `src/widgets/index.js` file or you will get 404s.
*/
function Overview({ data, region }) {
  // const totalGrantees = `Grantees served (of ${data.numGrantees})`;
  return (
    <Container>
      <Grid row className="smart-hub--overview-padding">
        <h2>
          Region
          {' '}
          {region}
          {' '}
          TTA Overview
        </h2>
        <span className="smart-hub--overview-period"> 3/17/21 to Today</span>
      </Grid>
      <Grid row>
        <Field col={3} label={`Grantees served (of ${data.numTotalGrantees})`} data={data.numGrantees} />
        <Field label="Activity reports" data={data.numReports} />
        <Field label="Participants" data={data.numParticipants} />
        <Field label="Hrs of Training" data={data.sumTrainingDuration} />
        <Field label="Hrs of TA" data={data.sumTaDuration} />
        <Field col={1} label="Hrs of TTA" data={data.sumDuration} />
      </Grid>
    </Container>
  );
}

Overview.propTypes = {
  data: PropTypes.shape({
    numReports: PropTypes.string,
    numGrantees: PropTypes.string,
    numTotalGrantees: PropTypes.string,
    numParticipants: PropTypes.string,
    sumTrainingDuration: PropTypes.string,
    sumTaDuration: PropTypes.string,
    sumDuration: PropTypes.string,
  }).isRequired,
  region: PropTypes.number.isRequired,
};

export default withWidgetData(Overview, 'overview');
