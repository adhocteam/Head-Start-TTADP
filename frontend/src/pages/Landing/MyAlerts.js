import React from 'react';
import PropTypes from 'prop-types';
import { Tag, Table } from '@trussworks/react-uswds';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import Container from '../../components/Container';
import NewReport from './NewReport';
import 'uswds/dist/css/uswds.css';
import '@trussworks/react-uswds/lib/index.css';
import './index.css';

function renderReports(reports) {
  return reports.map((report) => {
    const {
      id,
      displayId,
      activityRecipients,
      startDate,
      author,
      collaborators,
      status,
    } = report;

    const recipientsTitle = activityRecipients.reduce(
      (result, ar) => `${result + (ar.grant ? ar.grant.grantee.name : ar.name)}\n`,
      '',
    );

    const recipients = activityRecipients.map((ar) => (
      <Tag
        key={ar.name.slice(1, 3) + ar.id}
        className="smart-hub--table-collection"
      >
        {ar.grant ? ar.grant.grantee.name : ar.name}
      </Tag>
    ));

    const collaboratorsTitle = collaborators.reduce(
      (result, collaborator) => `${result + collaborator.fullName}\n`,
      '',
    );

    const collaboratorsWithTags = collaborators.map((collaborator) => (
      <Tag
        key={collaborator.id}
        className="smart-hub--table-collection"
      >
        {collaborator.fullName}
      </Tag>
    ));

    return (
      <tr key={`my_alerts_${id}`}>
        <td>
          <Link
            to={`/activity-reports/${id}`}
            href={`/activity-reports/${id}`}
          >
            {displayId}
          </Link>
        </td>
        <td>
          <span className="smart-hub--ellipsis" title={recipientsTitle}>
            {recipients}
          </span>
        </td>
        <td>{startDate}</td>
        <td>
          <span className="smart-hub--ellipsis" title={author.fullName}>
            {author.fullName}
          </span>
        </td>
        <td>
          <span className="smart-hub--ellipsis" title={collaboratorsTitle}>
            {collaboratorsWithTags}
          </span>
        </td>
        <td>
          <Tag
            className={`smart-hub--table-tag-status smart-hub--status-${status}`}
          >
            {status === 'needs_action' ? 'Needs action' : status}
          </Tag>
        </td>
      </tr>
    );
  });
}

function MyAlerts({ reports }) {
  return (
    <>
      { reports && reports.length === 0 && (
      <Container className="landing" padding={0}>
        <div id="caughtUp">
          <div><h2>You&apos;re all caught up!</h2></div>
          <p id="beginNew">Would you like to begin a new activity report?</p>
          <NewReport />
        </div>
      </Container>
      ) }
      { reports && reports.length > 0 && (
      <SimpleBar>
        <Container className="landing inline-size" padding={0}>
          <Table bordered={false}>
            <caption className="smart-hub--table-caption">
              My activity report alerts
            </caption>
            <thead>
              <tr>
                <th scope="col">Report ID</th>
                <th
                  scope="col"
                >
                  Grantee
                </th>
                <th scope="col">Start date</th>
                <th
                  scope="col"
                >
                  Creator
                </th>
                <th scope="col">Collaborator(s)</th>
                <th
                  scope="col"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>{renderReports(reports)}</tbody>
          </Table>
        </Container>
      </SimpleBar>
      )}
    </>
  );
}

MyAlerts.propTypes = {
  reports: PropTypes.arrayOf(PropTypes.object),
};

MyAlerts.defaultProps = {
  reports: [],
};

export default MyAlerts;