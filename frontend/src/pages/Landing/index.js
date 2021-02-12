import React, { useState, useEffect } from 'react';
import { Tag, Table, Alert, Grid } from '@trussworks/react-uswds';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import Container from '../../components/Container';
import { getReports } from '../../fetchers/activityReports';
import 'uswds/dist/css/uswds.css';
import '@trussworks/react-uswds/lib/index.css';
import './index.css';

export const activityReportId = (id, regionId) => `R${
  regionId < 10
    ? `0${regionId}`
    : regionId
}-${id <= 999999 ? `00000${id}`.slice(-6) : id}`;

function renderReports(reports) {
  const emptyReport = {
    id: '',
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
      activityRecipients,
      startDate,
      author,
      topics,
      collaborators,
      lastSaved,
      status,
      regionId,
    } = report;

    const recipientsTitle = activityRecipients.reduce(
      (result, ar) => `${result + (ar.grant ? ar.grant.grantee.name : ar.name)}\n`,
      '',
    );

    const recipients = activityRecipients.map((ar) => (
      <Tag
        key={ar.name.slice(1, 3) + '_' + ar.id}
        className="smart-hub--table-collection"
      >
        {ar.grant ? ar.grant.grantee.name : ar.name}
      </Tag>
    ));

    const topicsTitle = topics.reduce(
      (result, topic) => `${result + topic}\n`,
      '',
    );

    const topicsWithTags = topics.map((topic) => (
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

    const fullId = !id
      ? ''
      : activityReportId(id, regionId);

    return (
      <tr key={'landing_' + id}>
        <th scope="row" >
          <Link
          to={'/activity-reports/' + id + '/activity-summary'}
          href={'/activity-reports/' + id + '/activity-summary'}
          >
            {fullId}
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
            className={'smart-hub--table-tag-status smart-hub--status-' + status}
          >
            {status}
          </Tag>
        </td>
        <td>
          <button type="button" className="smart-hub--dotdotdot">
            ...
          </button>
        </td>
      </tr>
    );
  });
}

function Landing() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [reports, updateReports] = useState([]);
  const [error, updateError] = useState();

  useEffect(() => {
    async function fetchReports() {
      setIsLoaded(false);
      try {
        const reps = await getReports();
        updateReports(reps);
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

  return (
    <>
      <Helmet>
        <title>Landing</title>
      </Helmet>
      <Grid row gap>
        <Grid col={3}>
          <h1 className="landing">Activity Reports</h1>
        </Grid>
        <Grid className="smart-hub--create-new-report">
          <Link
            to="/activity-reports/new"
            referrerPolicy="same-origin"
            className="usa-button smart-hub--new-report-btn"
            variant="unstyled"
          >
            <span className="smart-hub--plus">+</span>
            <span className="smart-hub--new-report">New Activity Report</span>
          </Link>
        </Grid>
        <Grid></Grid>
      </Grid>
      <Grid row>
        {error && (
          <Alert type="error" role="alert">
            {error}
          </Alert>
        )}
      </Grid>
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
            <tbody>{renderReports(reports)}</tbody>
          </Table>
        </Container>
      </SimpleBar>
    </>
  );
}

export default Landing;