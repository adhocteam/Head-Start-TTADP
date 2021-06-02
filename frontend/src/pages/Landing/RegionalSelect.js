/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import { Button } from '@trussworks/react-uswds';

import 'uswds/dist/css/uswds.css';
import '@trussworks/react-uswds/lib/index.css';
import './index.css';
import './RegionalSelect.css';

import triangleDown from '../../images/triange_down.png';
import check from '../../images/check.svg';

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <img alt="" style={{ width: '22px' }} src={triangleDown} />
  </components.DropdownIndicator>
);

const Placeholder = (props) => <components.Placeholder {...props} />;

export const getUserOptions = (regions) => regions.map((region) => ({ value: region, label: `Region ${region}` }));

const styles = {
  container: (provided, state) => {
    // To match the focus indicator provided by uswds
    const outline = state.isFocused ? '0.25rem solid #2491ff;' : '';
    return {
      ...provided,
      outline,
    };
  },
  input: () => ({ display: 'none' }),
  control: (provided) => ({
    ...provided,
    borderColor: '#0166AB',
    backgroundColor: '#0166AB',
    borderRadius: '5px',
    paddingLeft: '5px',
    paddingTop: '4px',
    paddingBottom: '4px',
    whiteSpace: 'nowrap',
    color: 'white',
  }),
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

function RegionalSelect(props) {
  const {
    regions, onApply,
  } = props;

  const [selectedItem, setSelectedItem] = useState();
  const [appliedItem, setAppliedItem] = useState();
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  // const delayedCloseMenu = () => setTimeout(setMenuIsOpen(false), 1000);

  const CustomOption = (props1) => {
    const {
      data, innerRef, innerProps, isSelected,
    } = props1;
    return data.custom ? (
      <div ref={innerRef} {...innerProps}>
        <Button
          type="button"
          className="float-left margin-2 smart-hub--filter-button"
          onClick={() => {
            onApply(selectedItem);
            setAppliedItem(selectedItem);
            setMenuIsOpen(false);
          }}
        >
          Apply
        </Button>
      </div>
    ) : (
      <components.Option {...props1}>
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

  CustomOption.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    data: PropTypes.object.isRequired,
    innerRef: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    innerProps: PropTypes.object.isRequired,
  };

  const options = [...getUserOptions(regions), { custom: true }];
  return (
    <Select
      options={options}
      menuIsOpen={menuIsOpen}
      onChange={(value) => { if (value && value.value) setSelectedItem(value); }}
      onMenuOpen={() => setMenuIsOpen(true)}
      onBlur={() => setMenuIsOpen(false)}
      // onBlur={() => delayedCloseMenu()}
      name="RegionalSelect"
      defaultValue={options[0]}
      value={{
        value: selectedItem ? selectedItem.value : options[0].value,
        label: appliedItem ? appliedItem.label : options[0].label,
      }}
      styles={styles}
      components={{ Placeholder, DropdownIndicator, Option: CustomOption }}
      placeholder="Select Region"
      closeMenuOnSelect={false}
      maxMenuHeight={600}
    />
  );
}

RegionalSelect.propTypes = {
  regions: PropTypes.arrayOf(PropTypes.number).isRequired,
  onApply: PropTypes.func.isRequired,
};

export default RegionalSelect;