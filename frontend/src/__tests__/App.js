import React from 'react';
import '@testing-library/jest-dom';
import join from 'url-join';
import {
  screen, render, waitFor, fireEvent,
} from '@testing-library/react';
import fetchMock from 'fetch-mock';
import App from '../App';

describe('App', () => {
  afterEach(() => fetchMock.restore());
  const userUrl = join(process.env.REACT_APP_API_URL, 'user');
  const logoutUrl = join(process.env.REACT_APP_API_URL, 'logout');

  describe('when authenticated', () => {
    beforeEach(() => {
      const user = { name: 'name' };
      fetchMock.get(userUrl, { ...user });
      fetchMock.get(logoutUrl, 200);
      render(<App />);
    });

    it('displays the logout button', async () => {
      expect(await waitFor(() => screen.getByText('Logout'))).toBeVisible();
    });

    it('can log the user out when "logout" is pressed', async () => {
      const logout = await waitFor(() => screen.getByText('Logout'));
      fireEvent.click(logout);
      expect(await waitFor(() => screen.getByText('HSES Login'))).toBeVisible();
    });
  });

  describe('when unauthenticated', () => {
    beforeEach(() => {
      fetchMock.get(userUrl, 401);
      render(<App />);
    });

    it('displays the logout button', async () => {
      expect(await waitFor(() => screen.getByText('HSES Login'))).toBeVisible();
    });
  });
});
