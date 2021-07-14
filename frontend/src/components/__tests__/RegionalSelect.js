import '@testing-library/jest-dom';
import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import RegionalSelect from '../RegionalSelect';

const renderRegionalSelect = (onApplyRegion) => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <RegionalSelect
        regions={[1, 2]}
        onApply={onApplyRegion}
      />
    </Router>,
  );
  return history;
};

describe('Regional Select', () => {
  test('displays correct region in input', async () => {
    renderRegionalSelect();
    const input = await screen.findByText(/region 1/i);
    expect(input).toBeVisible();
  });

  test('changes input value on apply', async () => {
    const onApplyRegion = jest.fn();
    renderRegionalSelect(onApplyRegion);
    const input = await screen.findByText(/region 1/i);
    expect(input).toBeVisible();

    fireEvent.click(input);

    fireEvent.click(screen.getByRole('button', {
      name: /select to view data from region 2\. select apply filters button to apply selection/i,
    }));

    const applyButton = screen.getByRole('button', { name: 'Apply filters' });
    fireEvent.click(applyButton);

    expect(onApplyRegion).toHaveBeenCalled();
  });
});
