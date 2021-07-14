import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './ButtonSelect.css';
import triangleDown from '../images/triange_down.png';
import check from '../images/check.svg';

function ButtonSelect(props) {
  const {
    options, onApply, labelId, initialValue, applied, labelText,
  } = props;

  const [selectedItem, setSelectedItem] = useState();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  useEffect(() => {
    if (!selectedItem && !applied) {
      setSelectedItem(initialValue);
    }
  }, [applied, initialValue, selectedItem]);

  const onApplyClick = () => {
    onApply(selectedItem);
    setMenuIsOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 27) {
      setMenuIsOpen(false);
    }
  };

  const onBlur = (e) => {
    // if we're within the same menu, do nothing
    if (e.relatedTarget && e.relatedTarget.matches('.smart-hub--button')) {
      return;
    }

    setMenuIsOpen(false);
  };

  return (
    <div className="margin-left-1" onBlur={onBlur}>
      <button
        onClick={setMenuIsOpen}
        onKeyDown={onKeyDown}
        className="usa-button smart-hub--button-select-toggle-btn display-flex"
        aria-label="open date range options menu"
        type="button"
      >
        {selectedItem ? selectedItem.label : options[0].label}
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
};

export default ButtonSelect;
