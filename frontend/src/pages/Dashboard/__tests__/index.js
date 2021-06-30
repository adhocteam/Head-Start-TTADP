import '@testing-library/jest-dom';
import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import Dashboard from '../index';
import { formatDateRange } from '../constants';

describe('Dashboard page', () => {
  const renderDashboard = (user) => render(<Dashboard user={user} />);

  const user = {
    permissions: [],
  };

  it('shows a heading', async () => {
    renderDashboard(user);
    const heading = await screen.findByText(/region [0-9] tta activity dashboard/i);
    expect(heading).toBeInTheDocument();
  });

  it('shows a date range selector', async () => {
    renderDashboard(user);
    const dateRange = await screen.findByRole('button', { name: /open date range options menu/i });
    expect(dateRange).toBeInTheDocument();
  });

  it('shows the currently selected date range', async () => {
    renderDashboard(user);

    const thirtyDays = formatDateRange(1, { withSpaces: true });
    const selectedRange = await screen.findByText(thirtyDays);
    expect(selectedRange).toBeInTheDocument();
  });

  it('shows the currently applied date range', async () => {
    renderDashboard(user);

    const button = screen.getByRole('button', { name: /open date range options menu/i });
    fireEvent.click(button);

    const custom = screen.getByRole('button', { name: /select to view data from custom date range\. select apply filters button to apply selection/i });
    fireEvent.click(custom);

    const apply = screen.getByRole('button', { name: 'Apply filters' });
    fireEvent.click(apply);

    expect(screen.getByRole('textbox', { name: /start date/i })).toBeInTheDocument();
  });

  it('formats a date range correctly with 0 as an option', async () => {
    const blank = formatDateRange(0);
    expect(blank).toBe('');
  });

  it('renders a loading div when no user is provided', async () => {
    renderDashboard(null);
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });

  it('shows the reason list widget', async () => {
    renderDashboard(user);
    expect(screen.getByText(/reasons in activity reports/i)).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /reason/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /# of activities/i })).toBeInTheDocument();
  });
});