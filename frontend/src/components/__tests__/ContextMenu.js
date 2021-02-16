import '@testing-library/jest-dom';
import React from 'react';
import {
  render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContextMenu from '../ContextMenu';

const menuItems = (label = 'one', onClick = () => {}) => [
  {
    label,
    onClick,
  },
  {
    label: 'two',
    onClick: () => {},
  },
];

describe('ContextMenu', () => {
  it('hides the menu by default', async () => {
    render(<ContextMenu menuItems={menuItems()} label="label" />);
    const buttons = screen.queryAllByTestId('button');
    await waitFor(() => expect(buttons.length).toEqual(1));
    expect(await screen.findByLabelText('label')).toBeVisible();
  });

  describe('when the menu is open', () => {
    it('displays all menu items', async () => {
      render(<ContextMenu menuItems={menuItems()} label="label" />);
      const button = await screen.findByTestId('button');
      userEvent.click(button);

      expect(await screen.findByText('one')).toBeVisible();
      expect(await screen.findByText('two')).toBeVisible();
    });

    it("calls the menu item's onClick", async () => {
      const onClick = jest.fn();
      render(<ContextMenu menuItems={menuItems('one', onClick)} label="label" />);
      const button = await screen.findByTestId('button');
      userEvent.click(button);

      const oneButton = await screen.findByText('one');
      userEvent.click(oneButton);
      await waitFor(() => expect(onClick).toHaveBeenCalled());
    });

    it('hides the menu on blur', async () => {
      render(
        <>
          <ContextMenu menuItems={menuItems()} label="label" />
          <div data-testid="other" />
          );
        </>,
      );
      const button = await screen.findByTestId('button');
      userEvent.click(button);

      const other = await screen.findByTestId('other');
      userEvent.click(other);

      await waitFor(() => expect(screen.queryByText('one')).toBeNull());
      await waitFor(() => expect(screen.queryByText('two')).toBeNull());
    });
  });
});