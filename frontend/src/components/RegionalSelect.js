import React from 'react';
import PropTypes from 'prop-types';
import ButtonSelect from './ButtonSelect';

export const getUserOptions = (regions) => regions.map((region) => ({ value: region, label: `Region ${region}` })).sort((a, b) => a.value - b.value);

function RegionalSelect(props) {
  const {
    regions, onApply, hasCentralOffice, appliedRegion,
  } = props;

  let options = [...getUserOptions(regions)];

  if (hasCentralOffice) {
    options = [...getUserOptions(regions), { label: 'All Regions', value: 14 }];
  }

  const initialValue = hasCentralOffice ? { label: 'All Regions', value: 14 } : options[0];

  return (
    <ButtonSelect
      options={options}
      onApply={onApply}
      initialValue={initialValue}
      labelId="regionSelect"
      labelText="Region Select Options"
      applied={appliedRegion}
    />
  );
}

RegionalSelect.propTypes = {
  regions: PropTypes.arrayOf(PropTypes.number).isRequired,
  onApply: PropTypes.func.isRequired,
  hasCentralOffice: PropTypes.bool,
  appliedRegion: PropTypes.number,
};

RegionalSelect.defaultProps = {
  hasCentralOffice: false,
  appliedRegion: 0,
};

export default RegionalSelect;
