import React from 'react';
import PropTypes from 'prop-types';
import RegionalSelect from '../../Landing/RegionalSelect';

export default function RegionDisplay({
  appliedRegion, regions, onApplyRegion, hasCentralOffice,
}) {
  return (
    <>
      <h1 className="landing">
        Region
        {' '}
        {appliedRegion === 14 ? 'All' : appliedRegion }
        {' '}
        TTA Activity Dashboard
      </h1>

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
  appliedRegion: PropTypes.number,
  regions: PropTypes.arrayOf(PropTypes.number),
  onApplyRegion: PropTypes.func,
  hasCentralOffice: PropTypes.bool,
};

RegionDisplay.defaultProps = {
  appliedRegion: 0,
  regions: [],
  onApplyRegion: () => {},
  hasCentralOffice: false,
};
