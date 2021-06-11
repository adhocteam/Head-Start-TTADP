import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import DateRangePicker from '../../../components/DateRangePicker';
import { formatDateRange, CUSTOM_DATE_RANGE } from '../constants';

export default function DateSelect(props) {

    const { selectedDateRangeOption, dateRange, updateDateRange, focusedControl } = props;      

    // just a check to see if the "custom date range" option is selected
    const isCustom = selectedDateRangeOption === CUSTOM_DATE_RANGE;

    // handle updating the query for the page
    const onUpdateFilter = (query, date) => {
        updateDateRange(date);
    }

    useEffect( ()=> {
        console.log('test')
    }, [focusedControl])

    

    /**
     * if custom range is selected, render the twin date pickers
     */

    if( isCustom ) {
   
         return (            
            <DateRangePicker 
                id="mainDateSelect"
                query={dateRange}
                onUpdateFilter={onUpdateFilter}
                classNames={['display-flex']}             
                gainFocus={false}                
            />
         
        )
    }

    /**
     * 
     * otherwise format the date range for display
     */

    const dateInExpectedFormat = formatDateRange(selectedDateRangeOption, { forDateTime: true } ); 
    const prettyPrintedQuery = formatDateRange( selectedDateRangeOption, { withSpaces: true } );

    return(        
        <time className="display-flex flex-align-center" dateTime={dateInExpectedFormat}>{prettyPrintedQuery}</time>
    ) 
}

DateSelect.propTypes = {
    selectedDateRangeOption: PropTypes.number, 
    dateRange: PropTypes.string, 
    updateDateRange: PropTypes.func
};

