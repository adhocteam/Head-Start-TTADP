import React from 'react';
import PropTypes from 'prop-types';

import DateRangePicker from '../../../components/DateRangePicker';
import { CUSTOM_DATE_RANGE } from '../constants';

import DateTime from '../../../components/DateTime';

export default function DateSelect(props) {
  const {
    selectedDateRangeOption, dateRange, updateDateRange, gainFocus, dateTime,
  } = props;

  // just a check to see if the "custom date range" option is selected
  const isCustom = selectedDateRangeOption === CUSTOM_DATE_RANGE;

  // handle updating the query for the page
  const onUpdateFilter = (query, date) => {
    updateDateRange(date);
  };

  /**
     * if custom range is selected, render the twin date pickers
     */

  if (isCustom) {
    return (
      <DateRangePicker
        id="mainDateSelect"
        query={dateRange}
        onUpdateFilter={onUpdateFilter}
        classNames={['display-flex']}
        gainFocus={gainFocus}

      />
    );
  }

  return <DateTime classNames="display-flex flex-align-center" timestamp={dateTime.dateInExpectedFormat} label={dateTime.prettyPrintedQuery} />;
}

DateSelect.propTypes = {
  selectedDateRangeOption: PropTypes.number,
  dateRange: PropTypes.string,
  updateDateRange: PropTypes.func,
  gainFocus: PropTypes.bool,
  dateTime: PropTypes.shape({
    dateInExpectedFormat: PropTypes.string,
    prettyPrintedQuery: PropTypes.string,
  }),
};

DateSelect.defaultProps = {
  dateRange: '',
  dateTime: {
    dateInExpectedFormat: '',
    prettyPrintedQuery: '',
  },
  selectedDateRangeOption: 0,
  gainFocus: false,
  updateDateRange: () => {},
};
