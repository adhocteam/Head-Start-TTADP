import React from 'react';
import PropTypes from 'prop-types';
import RegionDropdown from '../../components/RegionDropdown';

import 'uswds/dist/css/uswds.css';
import '@trussworks/react-uswds/lib/index.css';
import './index.css';

function RegionSelect(props) {
  const {
    regionId, onChange,
  } = props;
  return (
    <RegionDropdown
      id="selected-region"
      name="selectedRegionId"
      value={regionId || undefined}
      onChange={onChange}
      className="smart-hub--region-dropdown arrow-down"
      defaultText="Select Region"
      includeLabel={false}
    />
  );
}

RegionSelect.propTypes = {
  regionId: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

// RegionSelect.defaultProps = {
//   col: 2,
// };

export default RegionSelect;
