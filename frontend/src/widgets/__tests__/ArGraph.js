import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArGraphWidget, reasonsWithLineBreaks } from '../ArGraph';

const TEST_DATA = [{
  reason: 'CLASS: Instructional Support',
  count: 12,
  participants: [],
},
{
  reason: 'Coaching',
  count: 0,
  participants: [],
},
{
  reason: 'Communication',
  count: 0,
  participants: [],
},
{
  reason: 'Community and Self-Assessment',
  count: 155,
  participants: [],
},
{
  reason: 'Curriculum (Early Childhood or Parenting)',
  count: 0,
  participants: [],
},
{
  reason: 'Data and Evaluation',
  count: 0,
  participants: [],
},
{
  reason: 'Environmental Health and Safety',
  count: 0,
  participants: [],
},
{
  reason: 'Equity, Culture & Language',
  count: 0,
  participants: [],
},
{
  reason: 'ERSEA',
  count: 0,
  participants: [],
},
{
  reason: 'Facilities',
  count: 0,
  participants: [],
},
{
  reason: 'Family Support Services',
  count: 53,
  participants: [],
},
{
  reason: 'Fiscal / Budget',
  count: 0,
  participants: ['Louise'],
},
{
  reason: 'Five-Year Grant',
  count: 33,
  participants: ['Bob'],
},
{
  reason: 'Human Resources',
  count: 0,
  participants: ['Gene'],
},
{
  reason: 'Leadership / Governance',
  count: 0,
  participants: [],
},
{
  reason: 'Learning Environments',
  count: 6,
  participants: [],
},
{
  reason: 'Nutrition',
  count: 0,
  participants: [],
},
{
  reason: 'Oral Health',
  count: 0,
  participants: [],
}];

const renderArGraphOverview = async (props) => (
  render(
    <ArGraphWidget data={props.data} dateTime={['', '', '05/27/1967-08/21/1968']} />,
  )
);

describe('AR Graph Widget', () => {
  it('shows the correct data', async () => {
    renderArGraphOverview({ data: TEST_DATA });

    const graphTitle = screen.getByText(/Topics in Activity Report by Frequency/i);
    await expect(graphTitle).toBeInTheDocument();

    // screen.logTestingPlaygroundURL();

    expect(true).toBe(false);
  });

  it('allows changing of the order', async () => {
    renderArGraphOverview({ data: TEST_DATA });

    const select = screen.getByRole('combobox', {
      name: /change topic data order/i,
    });

    fireEvent.change(select, { target: { value: 'asc' } });

    screen.logTestingPlaygroundURL();

    // jest.spyOn()

    expect(true).toBe(false);
  });

  it('correctly inserts line breaks', () => {
    const formattedReason = reasonsWithLineBreaks('Equity, Culture &amp; Language');
    expect(formattedReason).toBe('Equity,<br />Culture<br />&amp;<br />Language');
  });
});
