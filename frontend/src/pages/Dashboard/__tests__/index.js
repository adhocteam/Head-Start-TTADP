import '@testing-library/jest-dom';
import React from 'react';
import {
  render, screen, fireEvent
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../index';
import { formatDateRange } from '../constants';

describe( 'Dashboard page', () => {
    
    const RenderDashboard = ({user}) => {        
        return <Dashboard user={user}/>
    };

    it('shows a heading', async ()=> {
        const user = {};       
        render( <RenderDashboard user={user} />);

        const heading = await screen.findByText(/region tta activity dashboard/i);

        expect(heading).toBeInTheDocument();
    });


    it('shows a date range selector', async ()=> {
        const user = {};       
        render( <RenderDashboard user={user} />);

        const dateRange = await screen.findByRole('button', { name: /open date range options menu/i })

        expect(dateRange).toBeInTheDocument();
    });


    it('shows the currently selected date range', async ()=> {     
        const user = {};       
        render( <RenderDashboard user={user} />);

        const thirtyDays = formatDateRange( 1, { withSpaces: true } )
        const selectedRange = await screen.findByText(thirtyDays)
        expect( selectedRange ).toBeInTheDocument();
    });


    it( 'shows the currently applied date range', async ()=> {           
        const user = {};       
        render( <RenderDashboard user={user} />);    

        const button = screen.getByRole('button', { name: /open date range options menu/i });
        fireEvent.click( button );
        
        const custom = screen.getByRole('button', { name: /select to view data from custom date range\. select apply filters button to apply selection/i });
        fireEvent.click( custom );

        const apply = screen.getByRole('button', { name: "Apply filters" });
        fireEvent.click(apply);

        expect( screen.getByRole('textbox', { name: /start date/i }) ).toBeInTheDocument();    
    });


    it('formats a date range correctly with 0 as an option', async () => {
        const blank = formatDateRange( 0 );
        expect(blank).toBe("");
    });

    it('renders a loading div when no user is provided', async()=> {
        render( <RenderDashboard />);  
        expect( screen.getByText(/loading\.\.\./i) ).toBeInTheDocument();
    });

});