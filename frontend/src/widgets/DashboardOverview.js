import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@trussworks/react-uswds';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar, faUserFriends, faUser, faClock, faBuilding,
} from '@fortawesome/free-solid-svg-icons';
import withWidgetData from './withWidgetData';
import './DashboardOverview.css';

function Field({
  label, labelExt, data, icon, iconColor, backgroundColor,
}) {
  return (
    <div className="smart-hub--dashboard-overview-field flex-1 display-flex bg-white shadow-2 padding-2">
      <span className="smart-hub--dashboard-overview-field-icon flex-1 display-flex flex-justify-center flex-align-center">
        <span className="smart-hub--dashboard-overview-field-icon-background display-flex flex-justify-center flex-align-center" style={{ backgroundColor }}>
          <FontAwesomeIcon color={iconColor} icon={icon} />
        </span>
      </span>
      <span className="smart-hub--dashboard-overview-field-label display-flex flex-2 flex-column flex-justify-center">
        <span className="text-bold smart-hub--overview-font-size">{data}</span>
        {label}
        {' '}
        {labelExt}
      </span>
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string,
  labelExt: PropTypes.string,
  data: PropTypes.string,
  icon: PropTypes.shape({
    prefix: PropTypes.string,
    iconName: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    icon: PropTypes.array,
  }),
  iconColor: PropTypes.string,
  backgroundColor: PropTypes.string,
};

Field.defaultProps = {
  label: '',
  labelExt: '',
  data: '',
  icon: {
    prefix: 'fas',
    iconName: 'user',
    icon: [
      448,
      512,
      [],
      'f007',
      'M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z',
    ],
  },
  iconColor: '',
  backgroundColor: '',
};

export function DashboardOverviewWidget({ data }) {
  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <div className="smart-hub--dashboard-overview margin-bottom-3">
      <Grid row className="smart-hub--dashboard-overview-data flex-wrap">
        <Field icon={faChartBar} iconColor="#148439" backgroundColor="#F0FCF4" label="Activity reports" data={data.numReports} />
        <Field icon={faBuilding} iconColor="#2B7FB9" backgroundColor="#E2EFF7" label="Grants served" data={data.numGrants} />
        <Field icon={faUserFriends} iconColor="#264A64" backgroundColor="#ECEEF1" label="Non-grantees served" data={data.nonGrantees} />
        <Field icon={faClock} iconColor="#E29F4D" backgroundColor="#FFF1E0" label="Hours of TTA" data={data.sumDuration} />
        <Field icon={faUser} iconColor="#A12854" backgroundColor="#FFE8F0" label="In-person activities" data={data.inPerson} />
      </Grid>
    </div>
  );
}

DashboardOverviewWidget.propTypes = {
  data: PropTypes.shape({
    nonGrantees: PropTypes.string,
    numReports: PropTypes.string,
    numGrants: PropTypes.string,
    sumDuration: PropTypes.string,
    inPerson: PropTypes.string,
  }).isRequired,
};

export default withWidgetData(DashboardOverviewWidget, 'dashboardOverview');
