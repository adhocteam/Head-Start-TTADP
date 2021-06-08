import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@trussworks/react-uswds';
import { Helmet } from 'react-helmet';

// import Container from '../../components/Container';
import RegionalSelect from '../Landing/RegionalSelect';
import DateSelect from './components/DateSelect';
import DateRangeSelect from './components/DateRangeSelect';

import { hasReadWrite, allRegionsUserHasPermissionTo } from '../../permissions';

function Dashboard( props ) {

  const { user } = props;
 
  const [appliedRegion, updateAppliedRegion] = useState(0);
  const [appliedDateRange, updateAppliedDateRange ] = useState(0);

    // TODO - this is shared between here and ..Landing/index.js - should be consolidated to one file
    const getUserRegions = (user) => {
        const regions = allRegionsUserHasPermissionTo(user);
        if (appliedRegion === 0) updateAppliedRegion(regions[0]);
        return regions;
    };

    const onApplyRegion = (region) => {
        const regionId = region ? region.value : appliedRegion;
        updateAppliedRegion(regionId);
    };

    const onApplyDateRange = range => {       
        const rangeId = range ? range.value : appliedDateRange;        
        updateAppliedDateRange(rangeId);
    }

    if( !user ) {
        return (
            <div>Loading...</div>
        );
    }

    const userRegions = getUserRegions(user);

  return (
    <div className="smart-hub-tta-dashboard">
        <Helmet titleTemplate="%s - Dashboard - TTA Smart Hub" defaultTitle="TTA Smart Hub - Dashboard" />
           
                <>                  
                    <Helmet titleTemplate="%s - Dashboard - TTA Smart Hub" defaultTitle="TTA Smart Hub - Dashboard" />     
                    <Grid row>                        
                        <Grid col="auto">
                            <h1 className="landing">Region {appliedRegion} TTA Activity Dashboard</h1>
                        </Grid>
                        <div className="flex-fill display-flex flex-align-self-center flex-row">                            
                            
                            {userRegions.length > 1
                            && (
                            <RegionalSelect
                                
                                regions={allRegionsUserHasPermissionTo(user)}
                                onApply={onApplyRegion}
                            />
                            )}

                            <DateSelect                                 
                                onApply={onApplyDateRange} 
                            />

                            <DateRangeSelect appliedDateRange={appliedDateRange} />
                            
                        </div>                   

                    </Grid>
                </>
        
    </div>
  );
}

Dashboard.propTypes = {
    user: PropTypes.object
}

Dashboard.defaultProps = {
    user: null
}

export default Dashboard;
