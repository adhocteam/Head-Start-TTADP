import '@testing-library/jest-dom';
import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DateSelect from '../DateSelect';
import { formatDateRange } from '../../constants';

describe('DateSelect', () => {
  const renderSelect = (selectedDateRangeOption, updateDateRange, dateLabel = '') => {
    render(<DateSelect
      updateDateRange={updateDateRange}
      selectedDateRangeOption={selectedDateRangeOption}
      dateTime={['', '', dateLabel]}
    />);
  };

  it('shows a non interactive label when custom is not selected', () => {
    const selectedDateRangeOption = 1;
    const onUpdateFilter = jest.fn();
    const thirtyDays = formatDateRange(selectedDateRangeOption, { withSpaces: true });
    renderSelect(selectedDateRangeOption, onUpdateFilter, thirtyDays);
    expect(screen.getByText(thirtyDays)).toBeInTheDocument();
  });

  it('shows a date picker when custom is selected', () => {
    const onUpdateFilter = jest.fn();
    const selectedDateRangeOption = 2;
    renderSelect(selectedDateRangeOption, onUpdateFilter);

    const startDate = screen.getByRole('textbox', { name: /start date/i });
    const endDate = screen.getByRole('textbox', { name: /end date/i });

    expect(startDate).toBeEnabled();
    expect(endDate).toBeEnabled();
  });

  it('calls the update filter function when the date is changed', () => {
    const onUpdateFilter = jest.fn();
    const selectedDateRangeOption = 2;
    renderSelect(selectedDateRangeOption, onUpdateFilter);

    const startDate = screen.getByRole('textbox', { name: /start date/i });
    const endDate = screen.getByRole('textbox', { name: /end date/i });

    userEvent.type(startDate, '05/12/2021');
    userEvent.type(endDate, '05/12/2021');

    expect(onUpdateFilter).toHaveBeenCalledTimes(20);
  });
});
