import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardOverviewWidget } from '../DashboardOverview';

const renderDashboardOverview = (props) => (render(<DashboardOverviewWidget data={props.data} />));

describe('Dashboard Overview Widget', () => {
  it('shows the correct data', async () => {
    const data = {
      numReports: '5',
      numGrants: '2',
      numTotalGrants: '2',
      nonGrantees: '2',
      sumDuration: '2623.0',
      inPerson: '1.0',
    };

    renderDashboardOverview({ data });

    expect(screen.getByText(/5/i)).toBeInTheDocument();
    expect(screen.getByText(/activity reports/i)).toBeInTheDocument();
    expect(screen.getByText(/grants served \(of 2\)/i)).toBeInTheDocument();
    expect(screen.getByText(/non-grantees served/i)).toBeInTheDocument();
    expect(screen.getByText(/2623\.0/i)).toBeInTheDocument();
    expect(screen.getByText(/hours of tta/i)).toBeInTheDocument();
    expect(screen.getByText(/in-person activities/i)).toBeInTheDocument();
  });
});