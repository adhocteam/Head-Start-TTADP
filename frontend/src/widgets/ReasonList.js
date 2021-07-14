import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@trussworks/react-uswds';
import withWidgetData from './withWidgetData';
import Container from '../components/Container';
import DateTime from '../components/DateTime';
import './ReasonList.css';
import 'uswds/dist/css/uswds.css';

// import { DATE_FMT } from '../Constants';

/*
  Widgets only have to worry about presenting data. Filtering of the data happens at a
  higher level, which is why this component is wrapped with `withWidgetData`. `withWidgetData`
  takes care of fetching data, flagging the component as loading and handling errors while
  fetching data. Widgets are only rendered after data has been successfully loaded from the
  API. Note the `example` passed as a 2nd parameter to `withWidgetData` must match the widget
  id in the backend `src/widgets/index.js` file or you will get 404s.
*/

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
            <div className="display-flex">
              <span className="smart-hub--reason-list-heading">Reasons in Activity Reports</span>
              <DateTime classNames="display-flex flex-align-center padding-x-1 margin-left-3" timestamp={dateTime.timestamp} label={dateTime.label} />
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
              renderReasonList(data)
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
