import React from 'react';
import PropTypes from 'prop-types';
import { DATE_OPTIONS } from '../constants';
import 'uswds/dist/css/uswds.css';
import '@trussworks/react-uswds/lib/index.css';
import './DateRangeSelect.css';
import ButtonSelect from '../../../components/ButtonSelect';

export const getUserOptions = (regions) => regions.map((region) => ({ value: region, label: `Region ${region}` }));

export default function DateRangeSelect(props) {
  const { onApply } = props;

  const initialValue = {
    label: 'Last 30 Days',
    value: 1,
  };

  return (
    <ButtonSelect
      onApply={onApply}
      initialValue={initialValue}
      labelId="dateRangeOptionsLabel"
      labelText="Date range options"
      options={DATE_OPTIONS}
    />
  );
}

DateRangeSelect.propTypes = {
  onApply: PropTypes.func.isRequired,
};
