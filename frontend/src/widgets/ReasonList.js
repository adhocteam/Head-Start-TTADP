import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@trussworks/react-uswds';
import withWidgetData from './withWidgetData';
import Container from '../components/Container';
import './ReasonList.css';

/*
  Widgets only have to worry about presenting data. Filtering of the data happens at a
  higher level, which is why this component is wrapped with `withWidgetData`. `withWidgetData`
  takes care of fetching data, flagging the component as loading and handling errors while
  fetching data. Widgets are only rendered after data has been successfully loaded from the
  API. Note the `example` passed as a 2nd parameter to `withWidgetData` must match the widget
  id in the backend `src/widgets/index.js` file or you will get 404s.
*/
function ReasonList({ data, region }) {
    return (
        <Container className="">
            <Table class="usa-table usa-table--borderless smart-hub--reason-list-table">
            <caption>
                    <span className="smart-hub--reason-list-heading">Reasons in Activity Report</span>
                  </caption>
                <thead>
                    <tr>
                        <th scope="col">Reason</th>
                        <th scope="col"># of Activities</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </Table>
        </Container>
    );
}

ReasonList.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string,
        count: PropTypes.number,
    }).isRequired,
    region: PropTypes.number.isRequired,
};

export default withWidgetData(ReasonList, 'reasonList');
