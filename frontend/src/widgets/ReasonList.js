import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@trussworks/react-uswds';
import withWidgetData from './withWidgetData';
import Container from '../components/Container';
import DateTime from '../components/DateTime';
import './ReasonList.css';

function ReasonList({ data, dateTime }) {
  const renderReasonList = () => {
    if (data && Array.isArray(data) && data.length > 0) {
      return data.map((reason) => (
        <tr key={`reason_list_row_${reason.name}`}>
          <td>
            {reason.name}
          </td>
          <td>
            {reason.count}
          </td>
        </tr>
      ));
    }
    return null;
  };

  return (
    <Container className="reason-list shadow-2" padding={3}>
      <div className="usa-table-container--scrollable">
        <Table className="smart-hub--reason-list-table" fullWidth>
          <caption className="smart-hub--reason-list-caption">
            <div className="display-flex flex-wrap flex-align-center">
              <h2 className="smart-hub--reason-list-heading margin-0">Reasons in Activity Reports</h2>
              <DateTime classNames="padding-x-1 margin-left-3" timestamp={dateTime.timestamp} label={dateTime.label} />
            </div>
          </caption>
          <thead>
            <tr>
              <th scope="col" className="text-left">Reason</th>
              <th scope="col" className="text-left"># of Activities</th>
            </tr>
          </thead>
          <tbody>
            {
              renderReasonList()
            }
          </tbody>
        </Table>
      </div>
    </Container>
  );
}

ReasonList.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        count: PropTypes.number,
      }),
    ), PropTypes.shape({}),
  ]).isRequired,
  dateTime: PropTypes.shape({
    timestamp: PropTypes.string,
    label: PropTypes.string,
  }),
};

ReasonList.defaultProps = {
  dateTime: {
    timestamp: '',
    label: '',
  },
};

export default withWidgetData(ReasonList, 'reasonList');