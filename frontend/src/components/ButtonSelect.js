import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DateRangePicker from './DateRangePicker';
import './ButtonSelect.css';
import triangleDown from '../images/triange_down.png';
import check from '../images/check.svg';

function ButtonSelect(props) {
  const {
    // eslint-disable-next-line no-unused-vars
    options,
    onApply,
    labelId,
    initialValue,
    applied,
    labelText,
    hasDateRange,
    customDateRangeOption,
    updateDateRange,
    dateRangeShouldGainFocus,
    dateRangePickerId,
    dateRange,
  } = props;

  const [selectedItem, setSelectedItem] = useState();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [range, setRange] = useState();

  useEffect(() => {
    if (!selectedItem && !applied) {
      setSelectedItem(initialValue);
    }
  }, [applied, initialValue, selectedItem]);

  useEffect(() => {
    if (!range) {
      setRange(dateRange);
    }
  }, [range, dateRange]);

  const onApplyClick = () => {
    onApply(selectedItem);

    if (hasDateRange && selectedItem && selectedItem.value === customDateRangeOption) {
      updateDateRange(range);
    }

    setMenuIsOpen(false);
  };

  const onUpdateDateRange = (query, date) => {
    setRange(date);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 27) {
      setMenuIsOpen(false);
    }
  };

  const onBlur = (e) => {
    // if we're within the same menu, do nothing
    if (e.relatedTarget && e.relatedTarget.matches('.smart-hub--button-select-menu *')) {
      return;
    }

    // if we've a date range, also do nothing on blur when we click on those
    if (e.target.matches('.CalendarDay, .DayPickerNavigation_button')) {
      return;
    }

    setMenuIsOpen(false);
  };

  // get label text
  const label = options.find((option) => option.value === applied);

  return (
    <div className="margin-left-1" onBlur={onBlur}>
      <button
        onClick={setMenuIsOpen}
        onKeyDown={onKeyDown}
        className="usa-button smart-hub--button-select-toggle-btn display-flex"
        aria-label="open date range options menu"
        type="button"
      >
        {label ? label.label : options[0].label}
        <img src={triangleDown} alt="" aria-hidden="true" />
      </button>

      { menuIsOpen
        ? (
          <div className="smart-hub--button-select-menu" role="group" aria-describedby={labelId}>
            <span className="sr-only" id={labelId}>{labelText}</span>
            { options.map((option) => (
              <button
                type="button"
                aria-pressed={option === selectedItem}
                className="smart-hub--button smart-hub--button-select-range-button"
                key={option.value}
                onKeyDown={onKeyDown}
                data-value={option.value}
                aria-label={`Select to view data from ${option.label}. Select Apply filters button to apply selection`}
                onClick={() => {
                  setSelectedItem(option);
                }}
              >
                {option.label}
                { option.value === applied ? <img className="smart-hub--button-select-checkmark" src={check} alt="" aria-hidden="true" /> : null }
              </button>
            ))}

            { hasDateRange && selectedItem && selectedItem.value === customDateRangeOption
              ? (
                <DateRangePicker
                  id={dateRangePickerId}
                  query={dateRange}
                  onUpdateFilter={onUpdateDateRange}
                  classNames={['display-flex']}
                  gainFocus={dateRangeShouldGainFocus}
                />
              ) : null }

            <button type="button" onKeyDown={onKeyDown} className="usa-button smart-hub--button margin-2" onClick={onApplyClick} aria-label="Apply filters">Apply</button>
          </div>
        )
        : null }

    </div>

  );
}

ButtonSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number,
    label: PropTypes.string,
  })).isRequired,
  labelId: PropTypes.string.isRequired,
  labelText: PropTypes.string.isRequired,
  onApply: PropTypes.func.isRequired,
  initialValue: PropTypes.shape({
    value: PropTypes.number,
    label: PropTypes.string,
  }).isRequired,
  applied: PropTypes.number.isRequired,

  // props for handling the date range select
  hasDateRange: PropTypes.bool,
  customDateRangeOption: PropTypes.number,
  updateDateRange: PropTypes.func,
  dateRangeShouldGainFocus: PropTypes.bool,
  dateRange: PropTypes.string,
  dateRangePickerId: PropTypes.string,
};

ButtonSelect.defaultProps = {
  hasDateRange: false,
  customDateRangeOption: 0,
  dateRangeShouldGainFocus: false,
  updateDateRange: () => {},
  dateRange: '',
  dateRangePickerId: '',
};

export default ButtonSelect;
