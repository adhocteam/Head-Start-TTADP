import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DATE_OPTIONS } from '../constants';
import check from '../../../images/check.svg';
import triangleDown from '../../../images/triange_down.png';
import 'uswds/dist/css/uswds.css';
import '@trussworks/react-uswds/lib/index.css';
import './DateRangeSelect.css';

export const getUserOptions = (regions) => regions.map((region) => ({ value: region, label: `Region ${region}` }));

export default function DateRangeSelect(props) {
  const { onApply } = props;

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const onApplyClick = () => {
    onApply(selectedItem);
    setMenuIsOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 27) {
      setMenuIsOpen(false);
    }
  };

  /**
   * Grab the label text from the DATE_OPTIONS constant
   */
  const buttonText = selectedItem ? selectedItem.label : 'Select Date Range';

  return (
    <div className="margin-left-1">
      <button
        onClick={setMenuIsOpen}
        onKeyDown={onKeyDown}
        className="usa-button smart-hub--date-range-select-toggle-btn display-flex"
        aria-label="open date range options menu"
        type="button"
      >
        {buttonText}
        <img src={triangleDown} alt="" aria-hidden="true" />
      </button>

      { menuIsOpen
        ? (
          <div className="smart-hub--date-range-select-menu" role="group" aria-describedby="dateRangeOptionsLabel">
            <span className="sr-only" id="dateRangeOptionsLabel">Date range options</span>
            { DATE_OPTIONS.map((option) => (
              <button
                type="button"
                aria-pressed={option === selectedItem}
                className="smart-hub--date-range-select-range-button"
                key={option.value}
                onKeyDown={onKeyDown}
                data-value={option.value}
                aria-label={`Select to view data from ${option.label}. Select Apply filters button to apply selection`}
                onClick={() => {
                  setSelectedItem(option);
                }}
              >
                {option.label}
                { option === selectedItem ? <img className="smart-hub--date-range-select-checkmark" src={check} alt="" aria-hidden="true" /> : null }
              </button>
            ))}

            <button type="button" onKeyDown={onKeyDown} className="usa-button margin-2" onClick={onApplyClick} aria-label="Apply filters">Apply</button>
          </div>
        )
        : null }

    </div>
  );
}

DateRangeSelect.propTypes = {
  onApply: PropTypes.func,
};

DateRangeSelect.defaultProps = {
  onApply: () => {},
};
