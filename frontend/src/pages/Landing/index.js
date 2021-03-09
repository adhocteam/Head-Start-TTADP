import React, { useState, useEffect } from 'react';
import {
  Tag, Table, Alert, Grid, Button,
} from '@trussworks/react-uswds';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import UserContext from '../../UserContext';
import Container from '../../components/Container';
import { getReports, getReportAlerts } from '../../fetchers/activityReports';
import NewReport from './NewReport';
import 'uswds/dist/css/uswds.css';
import '@trussworks/react-uswds/lib/index.css';
import './index.css';
import MyAlerts from './MyAlerts';
import { hasReadWrite } from '../../permissions';
import ContextMenu from '../../components/ContextMenu';

function renderReports(reports, history) {
  const emptyReport = {
    id: '',
    displayId: '',
    activityRecipients: [],
    startDate: '',
    author: '',
    topics: [],
    collaborators: [],
    lastSaved: '',
    status: '',
  };

  const displayReports = reports.length ? reports : [emptyReport];

  return displayReports.map((report) => {
    const {
      id,
      displayId,
      activityRecipients,
      startDate,
      author,
      topics,
      collaborators,
      lastSaved,
      status,
    } = report;

    const recipientsTitle = activityRecipients.reduce(
      (result, ar) => `${result + (ar.grant ? ar.grant.grantee.name : ar.name)}\n`,
      '',
    );

    const recipients = activityRecipients.map((ar) => (
      <Tag
        key={`${ar.name.slice(1, 3)}_${ar.id}`}
        className="smart-hub--table-collection"
      >
        {ar.grant ? ar.grant.grantee.name : ar.name}
      </Tag>
    ));

    const topicsTitle = (topics || []).reduce(
      (result, topic) => `${result + topic}\n`,
      '',
    );

    const topicsWithTags = (topics || []).map((topic) => (
      <Tag
        key={topic.slice(1, 13)}
        className="smart-hub--table-collection"
      >
        {topic}
      </Tag>
    ));

    const collaboratorsTitle = collaborators.reduce(
      (result, collaborator) => `${result + collaborator.fullName}\n`,
      '',
    );

    const collaboratorsWithTags = collaborators.map((collaborator) => (
      <Tag
        key={collaborator.fullName.slice(1, 13)}
        className="smart-hub--table-collection"
      >
        {collaborator.fullName}
      </Tag>
    ));

    const menuItems = [
      {
        label: 'Edit',
        onClick: () => { history.push(`/activity-reports/${id}`); },
      },
    ];
    const contextMenuLabel = `Edit activity report ${displayId}`;

    return (
      <tr key={`landing_${id}`}>
        <th scope="row">
          <Link
            to={`/activity-reports/${id}`}
            href={`/activity-reports/${id}`}
          >
            {displayId}
          </Link>
        </th>
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
          <span className="smart-hub--ellipsis" title={topicsTitle}>
            {topicsWithTags}
          </span>
        </td>
        <td>
          <span className="smart-hub--ellipsis" title={collaboratorsTitle}>
            {collaboratorsWithTags}
          </span>
        </td>
        <td>{lastSaved}</td>
        <td>
          <Tag
            className={`smart-hub--table-tag-status smart-hub--status-${status}`}
          >
            {status === 'needs_action' ? 'Needs action' : status}
          </Tag>
        </td>
        <td>
          <ContextMenu label={contextMenuLabel} menuItems={menuItems} />
        </td>
      </tr>
    );
  });
}

function Landing() {
  const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const [reports, updateReports] = useState([]);
  const [reportAlerts, updateReportAlerts] = useState([]);
  const [error, updateError] = useState();
  const [showAlert, updateShowAlert] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      setIsLoaded(false);
      try {
        const reps = await getReports();
        const alerts = await getReportAlerts();
        updateReports(reps);
        updateReportAlerts(alerts);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
        updateError('Unable to fetch reports');
      }
      setIsLoaded(true);
    }
    fetchReports();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  let msg;
  const message = history.location.state && history.location.state.message;
  if (message) {
    msg = (
      <div>
        You successfully
        {' '}
        {message.status}
        {' '}
        report
        {' '}
        <Link to={`/activity-reports/${message.reportId}`}>
          {message.displayId}
        </Link>
        {' '}
        on
        {' '}
        {message.time}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Landing</title>
      </Helmet>
      <UserContext.Consumer>
        {({ user }) => (
          <>
            {showAlert && message && (
            <Alert
              type="success"
              noIcon
              cta={(
                <Button
                  role="button"
                  unstyled
                  aria-label="dissmiss alert"
                  onClick={() => updateShowAlert(false)}
                >
                  <span className="fa-sm">
                    <FontAwesomeIcon color="black" icon={faTimesCircle} />
                  </span>
                </Button>
              )}
            >
              {msg}
            </Alert>
            )}
            <Grid row gap>
              <Grid>
                <h1 className="landing">Activity Reports</h1>
              </Grid>
              <Grid className="flex-align-self-center">
                {reportAlerts && reportAlerts.length > 0 && hasReadWrite(user) && <NewReport />}
              </Grid>
            </Grid>
            <Grid row>
              {error && (
                <Alert type="error" role="alert">
                  {error}
                </Alert>
              )}
            </Grid>
            <MyAlerts reports={reportAlerts} newBtn={hasReadWrite(user)} />
            <SimpleBar>
              <Container className="landing inline-size" padding={0}>
                <Table className="usa-table usa-table--borderless usa-table--striped">
                  <caption>Activity reports</caption>
                  <thead>
                    <tr>
                      <th scope="col">Report ID</th>
                      <th scope="col">Grantee</th>
                      <th scope="col">Start date</th>
                      <th scope="col">Creator</th>
                      <th scope="col">Topic(s)</th>
                      <th scope="col">Collaborator(s)</th>
                      <th scope="col">Last saved</th>
                      <th scope="col">Status</th>
                      <th scope="col" aria-label="..." />
                    </tr>
                  </thead>
                  <tbody>{renderReports(reports, history)}</tbody>
                </Table>
              </Container>
            </SimpleBar>
          </>
        )}
      </UserContext.Consumer>
    </>
  );
}

export default Landing;
