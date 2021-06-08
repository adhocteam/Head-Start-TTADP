import React from 'react';
import {DATE_OPTIONS} from './DateSelect';

function DateRangeSelect(props) {

    const { appliedDateRange } = props;

    // todo - probably better to store this value as a const as well, and up a level
    const isCustom = appliedDateRange === DATE_OPTIONS[1].value;
    
    // console.log(appliedDateRange);
    //console.log(DATE_OPTIONS)

    if( isCustom ) {
         return (<p>Date PICKERS!</p>)
    }
    
    return(
        <span>10/01/2020 to 03/01/2021</span>
    ) 
}

export default DateRangeSelect;