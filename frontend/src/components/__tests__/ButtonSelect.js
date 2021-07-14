/* eslint-disable no-unused-vars */
/* eslint-disable jest/expect-expect */
import '@testing-library/jest-dom';
import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ButtonSelect from '../ButtonSelect';

const renderButtonSelect = () => {
  const options = [
    {
      label: 'Test',
      value: 1,
    },
    {
      label: 'Custom',
      value: 2,
    },
  ];

  const labelId = 'Test-Button-Select';
  const labelText = 'Give me a test, guv';
  const onApply = jest.fn();

  const initialValue = options[0];
  const applied = options[0].value;

  render(
    <div>
      <ButtonSelect
        options={options}
        labelId={labelId}
        labelText={labelText}
        onApply={onApply}
        initialValue={initialValue}
        applied={applied}
        ariaLabel="open menu"
        hasDateRange
      />

      <button type="button" data-testid="blanko">Blanko</button>
    </div>,
  );
};

describe('The Button Select component', () => {
  it('handles blur', () => {
    renderButtonSelect();

    const openMenu = screen.getByRole('button', {
      name: /open menu/i,
    });

    fireEvent.click(openMenu);

    const custom = screen.getByRole('button', {
      name: /select to view data from custom\. select apply filters button to apply selection/i,
    });

    fireEvent.click(custom);

    const startDate = screen.getByRole('textbox', {
      name: /start date/i,
    });

    const blanko = screen.getByRole('button', { name: /blanko/i });

    // is this the best way to fire on blur? yikes
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();
    userEvent.tab();

    expect(blanko).toHaveFocus();

    expect(startDate).not.toBeInTheDocument();
  });
});
