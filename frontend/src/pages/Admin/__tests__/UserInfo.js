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

    test('has a blank firstName', () => {
      expect(screen.getByLabelText('First Name')).toHaveValue('');
    });

    test('has a blank lastName', async () => {
      expect(screen.getByLabelText('Last Name')).toHaveValue('');
    });

    test('has the default region', () => {
      expect(screen.getByLabelText('Region')).toHaveValue('default');
    });

    test('has the default jobTitle', () => {
      expect(screen.getByLabelText('Job Title')).toHaveValue('default');
    });
  });

  describe('with a full user object', () => {
    beforeEach(() => {
      const user = {
        email: 'email',
        firstName: 'first',
        lastName: 'last',
        region: '1',
        jobTitle: 'Grantee Specialist',
      };

      render(<UserInfo user={user} onUserChange={() => {}} />);
    });

    test('has correct email', async () => {
      expect(screen.getByLabelText('Email')).toHaveValue('email');
    });

    test('has correct firstName', () => {
      expect(screen.getByLabelText('First Name')).toHaveValue('first');
    });

    test('has correct lastName', async () => {
      expect(screen.getByLabelText('Last Name')).toHaveValue('last');
    });

    test('has correct region', () => {
      expect(screen.getByLabelText('Region')).toHaveValue('1');
    });

    test('has correct jobTitle', () => {
      expect(screen.getByLabelText('Job Title')).toHaveValue('Grantee Specialist');
    });
  });
});
