import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

import UserInfo from '../UserInfo';

describe('UserInfo', () => {
  describe('with an empty user object', () => {
    beforeEach(() => {
      render(<UserInfo user={{}} onUserChange={() => {}} />);
    });

    test('has a blank email', async () => {
      expect(screen.getByLabelText('Email')).toHaveValue('');
    });

    test('has a blank fullName', () => {
      expect(screen.getByLabelText('Full Name')).toHaveValue('');
    });

    test('has the default region', () => {
      expect(screen.getByLabelText('Region')).toHaveValue('0');
    });

    test('has the default jobTitle', () => {
      expect(screen.getByLabelText('Role')).toHaveValue('default');
    });
  });

  describe('with a full user object', () => {
    beforeEach(() => {
      const user = {
        email: 'email',
        name: 'first last',
        homeRegionId: 1,
        role: 'Grantee Specialist',
      };

      render(<UserInfo user={user} onUserChange={() => {}} />);
    });

    test('has correct email', async () => {
      expect(screen.getByLabelText('Email')).toHaveValue('email');
    });

    test('has correct fullName', () => {
      expect(screen.getByLabelText('Full Name')).toHaveValue('first last');
    });

    test('has correct region', () => {
      expect(screen.getByLabelText('Region')).toHaveValue('1');
    });

    test('has correct jobTitle', () => {
      expect(screen.getByLabelText('Role')).toHaveValue('Grantee Specialist');
    });
  });
});
