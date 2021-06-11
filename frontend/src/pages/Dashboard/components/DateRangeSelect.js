import React, { useRef, useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import { Button } from '@trussworks/react-uswds';
import DropdownIndicator from '../../../components/DropDownIndicator';
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
  }

  /**
   * Grab the label text from the DATE_OPTIONS constant
   */
  const buttonText = selectedItem ? selectedItem.label : "Select Date Range";

  return (
    <div className="margin-x-1">
      <button 
        onClick={setMenuIsOpen}
        className="usa-button smart-hub--date-range-select-toggle-btn display-flex">
          {buttonText}<img src={triangleDown} alt="" aria-hidden="true"  />
        </button>
      { menuIsOpen ?
      <div className="smart-hub--date-range-select-menu">
          
          { DATE_OPTIONS.map( option => {                     
            return (      
              <button 
                aria-pressed={ option === selectedItem}
                className="smart-hub--date-range-select-range-button" 
                key={option.value} 
                data-value={option.value}
                onClick={()=> {
                  setSelectedItem( option );
                }}>
                  {option.label}

                { option === selectedItem ? <img className="smart-hub--date-range-select-checkmark" src={check} alt="" aria-hidden="true" /> : null } 

                </button>         
            )
          })}           

          <button className="usa-button margin-2" onClick={onApplyClick}>Apply</button>
        </div>
      : null }
   
    </div>
  );
}

DateRangeSelect.propTypes = {
  onApply: PropTypes.func,
};


