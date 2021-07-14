/* eslint-disable no-unused-vars */
/* eslint-disable jest/expect-expect */
import '@testing-library/jest-dom';
import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import ButtonSelect from '../ButtonSelect';

const renderButtonSelect = () => {
  const options = [
    {
      label: 'Test',
      value: 0,
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
        customDateRangeOption={0}
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

    fireEvent.click(screen.getByRole('button', {
      name: /open menu/i,
    }));

    expect(screen.getByRole('textbox', {
      name: /start date/i,
    })).toBeInTheDocument();

    screen.getByRole('button', { name: /blanko/i }).focus();

    expect(openMenu).toNotHaveFocus();

    expect(true).toBe(false);
  });

  it('does the thing', async () => {
    renderButtonSelect();
    expect(true).toBe(false);
  });
});
