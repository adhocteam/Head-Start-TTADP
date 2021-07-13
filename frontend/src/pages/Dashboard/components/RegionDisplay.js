import React from 'react';
import PropTypes from 'prop-types';
import RegionalSelect from '../../Landing/RegionalSelect';

export default function RegionDisplay({
  regions, onApplyRegion, hasCentralOffice,
}) {
  return (
    <>
      {regions.length > 1
        && (
        <RegionalSelect
          regions={regions}
          onApply={onApplyRegion}
          hasCentralOffice={hasCentralOffice}
        />
        )}
    </>
  );
}

RegionDisplay.propTypes = {
  regions: PropTypes.arrayOf(PropTypes.number),
  onApplyRegion: PropTypes.func,
  hasCentralOffice: PropTypes.bool,
};

RegionDisplay.defaultProps = {
  regions: [],
  onApplyRegion: () => {},
  hasCentralOffice: false,
};
