import React from 'react';
import '@testing-library/jest-dom';
import join from 'url-join';
import {
  screen, render, fireEvent,
} from '@testing-library/react';
import fetchMock from 'fetch-mock';
import App from '../App';

describe('App', () => {
  afterEach(() => fetchMock.restore());
  const userUrl = join('api', 'user');
  const logoutUrl = join('api', 'logout');

  describe('when authenticated', () => {
    beforeEach(() => {
      const user = { name: 'name' };
      fetchMock.get(userUrl, { ...user });
      fetchMock.get(logoutUrl, 200);
      render(<App />);
    });

    it('displays the logout button', async () => {
      expect(await screen.findByText('Logout')).toBeVisible();
    });

    it('can log the user out when "logout" is pressed', async () => {
      const logout = await screen.findByText('Logout');
      fireEvent.click(logout);
      expect(await screen.findByText('HSES Login')).toBeVisible();
    });
  });

  describe('when unauthenticated', () => {
    beforeEach(() => {
      fetchMock.get(userUrl, 401);
      render(<App />);
    });

    it('displays the login button', async () => {
      expect(await screen.findByText('HSES Login')).toBeVisible();
    });
  });
});
