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
    <Grid gap={4} desktop={{ col: 'fill' }} tablet={{ col: 6 }} mobileLg={{ col: 12 }} className="smart-hub--dashboard-overview-field margin-bottom-1 display-flex bg-white shadow-2 padding-2">
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
    </Grid>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  labelExt: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  icon: PropTypes.shape({
    prefix: PropTypes.string,
    iconName: PropTypes.string,
    // eslint-disable-next-line react/forbid-prop-types
    icon: PropTypes.array,
  }).isRequired,
  iconColor: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
};

export function DashboardOverviewWidget({ data }) {
  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <Grid row className="smart-hub--dashboard-overview margin-bottom-3">
      <Field icon={faChartBar} iconColor="#148439" backgroundColor="#F0FCF4" label="Activity reports" data={data.numReports} />
      <Field icon={faBuilding} iconColor="#2B7FB9" backgroundColor="#E2EFF7" label="Grants served" data={data.numGrants} />
      <Field icon={faUserFriends} iconColor="#264A64" backgroundColor="#ECEEF1" label="Non-grantees served" data={data.nonGrantees} />
      <Field icon={faClock} iconColor="#E29F4D" backgroundColor="#FFF1E0" label="Hours of TTA" data={data.sumDuration} />
      <Field icon={faUser} iconColor="#A12854" backgroundColor="#FFE8F0" label="In-person activities" data={data.inPerson} />
    </Grid>

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