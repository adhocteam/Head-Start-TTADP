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
    <div className="smart-hub--dashboard-overview-field flex-1 display-flex bg-white shadow-2 padding-2 margin-1">
      {icon ? (
        <span className="smart-hub--dashboard-overview-field-icon flex-1 display-flex flex-justify-center flex-align-center">
          <span className="smart-hub--dashboard-overview-field-icon-background display-flex flex-justify-center flex-align-center" style={{ backgroundColor }}>
            <FontAwesomeIcon color={iconColor} icon={icon} />
          </span>
        </span>
      ) : null }
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
  label: PropTypes.string.isRequired,
  labelExt: PropTypes.string,
  data: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  iconColor: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
};

Field.defaultProps = {
  labelExt: '',
};

function DashboardOverview({ data }) {
  return (
    <div className="smart-hub--dashboard-overview">
      <Grid row className="smart-hub--dashboard-overview-data flex-wrap">
        <Field icon={faChartBar} iconColor="#148439" backgroundColor="#F0FCF4" label="Activity reports" data={data.numReports} />
        <Field icon={faBuilding} iconColor="#2B7FB9" backgroundColor="#E2EFF7" label="Grants served" labelExt={`(of ${data.numGrants})`} data={data.numGrants} />
        <Field icon={faUserFriends} iconColor="#264A64" backgroundColor="#ECEEF1" label="Non-grantees served" data={data.nonGrantees} />
        <Field icon={faClock} iconColor="#E29F4D" backgroundColor="#FFF1E0" label="Hours of TTA" data={data.sumDuration} />
        <Field icon={faUser} iconColor="#A12854" backgroundColor="#FFE8F0" label="In-person activities" data={data.inPerson} />
      </Grid>
    </div>
  );
}

// To Do - Clean Up This
DashboardOverview.propTypes = {
  data: PropTypes.shape({
    granteeRequests: PropTypes.string,
    nonGrantees: PropTypes.string,
    numReports: PropTypes.string,
    numGrants: PropTypes.string,
    numTotalGrants: PropTypes.string,
    numParticipants: PropTypes.string,
    sumTrainingDuration: PropTypes.string,
    sumTaDuration: PropTypes.string,
    sumDuration: PropTypes.string,
    inPerson: PropTypes.string,
  }).isRequired,
};

export default withWidgetData(DashboardOverview, 'dashboardOverview');
