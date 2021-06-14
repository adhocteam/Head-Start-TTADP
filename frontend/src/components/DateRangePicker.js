import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button } from '@trussworks/react-uswds';
import { DateRangePicker as DateRange, isInclusivelyBeforeDay } from 'react-dates';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

import { DATE_FMT, EARLIEST_FILTER_DATE } from '../pages/Landing/constants';

const phrases = {
  focusStartDate: 'Interact with the calendar and add the dates for your date range',
  chooseAvailableStartDate: ({ date }) => `Choose ${date} for the earliest date`,
  chooseAvailableEndDate: ({ date }) => `Choose ${date} for the latest date`,
};

function DateRangePicker({
  query, onUpdateFilter, id, classNames, gainFocus,
}) {
  const [focusedInput, updateFocused] = useState(null);
  const [opened, updateOpened] = useState(false);

  const startDateId = `${id}-start`;
  const endDateId = `${id}-end`;

  useEffect(() => {
    /** *
     * This is for when the date range selector is conditionally created
     * It will auto focus the start date input
     */
    if (gainFocus) {
      const input = document.getElementById(startDateId);
      if (input) input.focus();
    }
  }, [gainFocus, startDateId]);

  let startDate;
  let endDate;
  if (query) {
    const dateStrings = query.split('-');
    startDate = dateStrings[0] ? moment(dateStrings[0], DATE_FMT) : null;
    endDate = dateStrings[1] ? moment(dateStrings[1], DATE_FMT) : null;
  }

  const onChange = (selectedStartDate, selectedEndDate) => {
    const startDateStr = selectedStartDate ? selectedStartDate.format(DATE_FMT) : '';
    const endDateStr = selectedEndDate ? selectedEndDate.format(DATE_FMT) : '';
    const date = `${startDateStr}-${endDateStr}`;
    onUpdateFilter('query', date);
  };

  const cssClasses = `ttahub-date-range-picker ${classNames.join(' ')}`;

  return (
    <span id={id} className={cssClasses}>
      <DateRange
        small
        phrases={phrases}
        focusedInput={focusedInput}
        startDateId={startDateId}
        endDateId={endDateId}
        startDate={startDate}
        numberOfMonths={1}
        hideKeyboardShortcutsPanel
        endDate={endDate}
        isOutsideRange={(day) => isInclusivelyBeforeDay(day, EARLIEST_FILTER_DATE)}
        onFocusChange={(focused) => {
          if (focusedInput !== null) {
            updateFocused(focused);
            updateOpened(focused !== null);
          }
        }}
        onDatesChange={({ startDate: selectedStartDate, endDate: selectedEndDate }) => {
          onChange(selectedStartDate, selectedEndDate);
          if (opened && selectedEndDate) {
            const input = document.getElementById(startDateId);
            if (input) input.focus();
          }
        }}
      />
      <Button
        onClick={() => { updateOpened(true); updateFocused('startDate'); }}
        aria-label={'open calendar"'}
        type="button"
        className="margin-top-auto margin-bottom-auto font-sans-xs margin-left-1 smart-hub--filter-date-picker-button"
        unstyled
      >
        <FontAwesomeIcon size="1x" color="gray" icon={faCalendar} />
      </Button>
    </span>
  );
}

DateRangePicker.propTypes = {
  query: PropTypes.string,
  onUpdateFilter: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  classNames: PropTypes.arrayOf(PropTypes.string),
  gainFocus: PropTypes.bool,
};

DateRangePicker.defaultProps = {
  query: '',
  classNames: [],
  gainFocus: false,
};

export default DateRangePicker;
