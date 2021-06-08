import React from 'react';
import { Grid } from '@trussworks/react-uswds';
import { Helmet } from 'react-helmet';

import UserContext from '../../UserContext';
import Container from '../../components/Container';

function Dashboard() {
  return (
    <div className="smart-hub-tta-dashboard">
        <Helmet titleTemplate="%s - Dashboard - TTA Smart Hub" defaultTitle="TTA Smart Hub - Dashboard" />
        <Grid row className="flex-justify">
            
            <Grid col="auto">
                <h1 className="landing">Region 12 TTA Activity Dashboard</h1>
            </Grid>

            <Grid col="auto" className="flex-align-self-center">
               
            </Grid>

        </Grid>
    </div>
  );
}

export default Dashboard;
