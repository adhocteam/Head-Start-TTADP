import '@testing-library/jest-dom';
import React from 'react';
import {
  render, screen
} from '@testing-library/react';
import Dashboard from '../index';
import { formatDateRange } from '../constants';



describe( 'Dashboard page', () => {
    
    const RenderDashboard = ({user}) => {
        return <Dashboard user={user}/>
    };

    it('shows a heading', async ()=> {
        const user = {};
        render( <RenderDashboard user={user}/>);

        const heading = await screen.findByText(/region tta activity dashboard/i);

        expect(heading).toBeInTheDocument();
    });


    it('shows a date range selector', async ()=> {
        const user = {};
        render( <RenderDashboard user={user}/>);

        const dateRange = await screen.findByRole('button', { name: /open date range options menu/i })

        expect(dateRange).toBeInTheDocument();
    });


    it('shows the currently selected date range', async ()=> {
        const user = {};
        render( <RenderDashboard user={user}/>);

        const thirtyDays = formatDateRange( 1, { withSpaces: true } )
        const selectedRange = await screen.findByText(thirtyDays)
        expect( selectedRange ).toBeInTheDocument();
    });

});