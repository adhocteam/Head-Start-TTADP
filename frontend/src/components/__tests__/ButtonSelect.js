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
    <ButtonSelect
      options={options}
      labelId={labelId}
      labelText={labelText}
      onApply={onApply}
      initialValue={initialValue}
      applied={applied}
    />,
  );
};

describe('The Button Select component', () => {
  it('handles blur', () => {
    renderButtonSelect();
  });

  it('does the thing', async () => {
    renderButtonSelect();
    screen.logTestingPlaygroundURL();
    expect(true).toBe(false);
  });
});
