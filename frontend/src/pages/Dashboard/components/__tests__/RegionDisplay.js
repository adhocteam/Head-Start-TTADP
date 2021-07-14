import '@testing-library/jest-dom';
import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import RegionDisplay from '../RegionDisplay';

describe('Region Display', () => {
  const renderRegionDisplay = (regions, appliedRegion) => {
    render(<RegionDisplay appliedRegion={appliedRegion} regions={regions} />);
  };

  it('renders the proper title', async () => {
    const regions = [14, 2];

    renderRegionDisplay(regions, 14);

    expect(screen.getByRole('heading', { name: /region all tta activity dashboard/i })).toBeInTheDocument();
  });
});
