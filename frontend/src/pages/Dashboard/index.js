import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@trussworks/react-uswds';
import { Helmet } from 'react-helmet';
import { v4 as uuidv4 } from 'uuid';
import RegionalSelect from '../Landing/RegionalSelect';
import DateSelect from './components/DateSelect';
import DateRangeSelect from './components/DateRangeSelect';

import { getUserRegions } from '../../permissions';
import { formatDateRange, CUSTOM_DATE_RANGE } from './constants';

function Dashboard( props ) {

    const { user } = props;
 
    const [appliedRegion, updateAppliedRegion] = useState(0);
    const [selectedDateRangeOption, updateSelectedDateRangeOption ] = useState(1);
    const [dateRange, updateDateRange] = useState("");   
    // const focusedControl = useRef(null);
    const [gainFocus, setGainFocus] = useState(false);
    
    /* 
    *    the idea is that this filters variable, which roughly matches the implementation on the landing page, 
    *    would be passed down into each visualization
    */

    const [filters, updateFilters] = useState([]);

    useEffect(()=> {        
        
        // The number and nature of the filters is static, so we can just update them like so
        const filters = [
            {
                id: uuidv4(), // note to self- is this just for unique keys/.map?
                topic: 'region',
                condition: 'Is equal to',
                query: appliedRegion,
            },
            {
                id: uuidv4(),
                topic: 'dateRange',
                condition: 'Is within',
                query: dateRange,
            }
        ];

        updateFilters(filters);
        
        
    },[ appliedRegion, dateRange ]);


    const onApplyRegion = (region) => {
        const regionId = region ? region.value : appliedRegion;
        updateAppliedRegion(regionId);
    };

    const onApplyDateRange = range => {       
        const rangeId = range ? range.value : selectedDateRangeOption;        
        updateSelectedDateRangeOption(rangeId);

        if( selectedDateRangeOption !== CUSTOM_DATE_RANGE ) {
            updateDateRange( formatDateRange(selectedDateRangeOption, { forDateTime: true}) );

            // set focus to DateRangePicker 1st input
            setGainFocus(true);
        }          

    }

    if( !user ) {
        return (
            <div>Loading...</div>
        );
    }

  const regions = getUserRegions(user);
    if (appliedRegion === 0) {
      updateAppliedRegion(regions[0]);
    }

  return (
    <div className="ttahub-dashboard">
        <Helmet titleTemplate="%s - Dashboard - TTA Smart Hub" defaultTitle="TTA Smart Hub - Dashboard" />
           
                <>                  
                    <Helmet titleTemplate="%s - Dashboard - TTA Smart Hub" defaultTitle="TTA Smart Hub - Dashboard" />     
                    <Grid row>                        
                        <Grid col="auto">
                            <h1 className="landing">Region {appliedRegion} TTA Activity Dashboard</h1>
                        </Grid>
                        <div className="tthub-dashboard--filters flex-fill display-flex flex-align-center flex-align-self-center flex-row">                            
                            
                            {regions.length > 1
                                && (
                                    <RegionalSelect                                
                                        regions={regions}
                                        onApply={onApplyRegion}
                                    />
                            )}

                            <DateRangeSelect                              
                                onApply={onApplyDateRange} 
                               
                            />

                            <DateSelect 
                                dateRange={dateRange}
                                updateDateRange={updateDateRange}
                                selectedDateRangeOption={selectedDateRangeOption}                                
                                gainFocus={gainFocus}                     
                            />
                            
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
