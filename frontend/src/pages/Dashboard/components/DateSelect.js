import React, { useRef, useState } from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import { Button } from '@trussworks/react-uswds';

import 'uswds/dist/css/uswds.css';
import '@trussworks/react-uswds/lib/index.css';

import DropdownIndicator from '../../../components/DropDownIndicator';
import { DATE_OPTIONS } from '../constants';

import check from '../../../images/check.svg';

export const getUserOptions = (regions) => regions.map((region) => ({ value: region, label: `Region ${region}` }));

function DateSelect(props) {

  const { onApply } = props;

  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const innerRef = useRef(null);

  const CustomOption = (props) => {
    const {
      data, innerProps, isSelected, innerRef
    } = props;

    const onButtonKeyPress = (e) => {
      if( e.keyCode === 13 ) {
        closeMenu();
      }     
    }

    const closeMenu = () => {
      onApply(selectedItem);
      setMenuIsOpen(false);
    }

    return data.custom ? (
      <div ref={innerRef} {...innerProps}>
        <Button
          type="button"
          className="float-left margin-2 smart-hub--filter-button"
          onClick={closeMenu}
          onKeyPress={onButtonKeyPress}          
        >
          Apply
        </Button>
      </div>
    ) : (
      <components.Option {...props}>
        {data.label}
        {isSelected && (
        <img
          className="tta-smarthub--check"
          src={check}
          style={{
            width: 32,
            float: 'right',
            marginTop: '-9px ',
          }}
          alt={data.label}
        />
        )}
      </components.Option>
    );
  };

  const styles = {
    container: (provided, state) => {
      // To match the focus indicator provided by uswds
      const outline = state.isFocused ? '0.25rem solid purple;' : '';
      return {
        ...provided,
        outline,
      };
    },
    input: () => ({ display: 'none' }),
    control: (provided, state) => {
      return{
        ...provided,
        borderColor: state.isFocused? 'red' : '#0166AB',
        backgroundColor: '#0166AB',
        borderRadius: '5px',
        minWidth: '200px',
        padding: ' 4px 8px',
        whiteSpace: 'nowrap',
        color: 'white',
        width: '120px',
       }
    },
    indicatorSeparator: () => ({ display: 'none' }),
    menu: (provided) => ({
      ...provided,
      width: '200px',
    }),
    // placeholder: () => ({
    //   color: 'white', fontWeight: 600, fontSize: '17px', marginRight: '-5px',
    // }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? '#0166AB' : 'black',
      fontWeight: state.isSelected ? '700' : 'normal',
      backgroundColor: state.isSelected ? '#F8F8F8' : '#FFFFFF',
      padding: 11,
    }),
    singleValue: (provided) => {
      const single = { color: '#FFFFFF', fontWeight: 600 };

      return {
        ...provided, ...single,
      };
    },
    valueContainer: () => ({ padding: '10px 8px' }),
  };

  const options = [...DATE_OPTIONS, {custom: true}];

  const onKeyDown = (e) => {  

    if(e.keyCode === 13 || e.keyCode == 40) {      
      innerRef.current.focus()
      setMenuIsOpen(true);
    }

    if( e.keyCode == 40 ) {
      if( !selectedItem ) {


        // setSelectedItem( options ); 

        console.log(options);
      }
    }

    if( e.keyCode === 27 ) {
      setMenuIsOpen(false);
    }



  }

  const onMenuOpen = () => {
      setMenuIsOpen(true);
  }

  return (
    <div className="margin-x-1" tabIndex="0" onKeyDown={onKeyDown} aria-label="select date range">
      <Select
        options={options}
        menuIsOpen={menuIsOpen}
        onChange={(value) => (value && value.value ? setSelectedItem(value) : null )}
        onMenuOpen={onMenuOpen}       
        onBlur={() => setMenuIsOpen(false)}
        name="Select Date Range"
        defaultValue={options[0]}
        value={{
          value: selectedItem ? selectedItem.value : options[0].value,
          label: selectedItem ? selectedItem.label : options[0].label,
        }}
        styles={styles}
        components={{ DropdownIndicator, Option: CustomOption }}
        placeholder="Select Date Range"
        closeMenuOnSelect={false}
        maxMenuHeight={600}
        tabSelectsValue={true}
        tabIndex="0"
        ref={innerRef}
      />
    </div>
  );
}

DateSelect.propTypes = {
  onApply: PropTypes.func,
  appliedItem: PropTypes.number
};


export default DateSelect;
