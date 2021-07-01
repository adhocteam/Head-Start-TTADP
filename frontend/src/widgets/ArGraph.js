import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js';
import { Grid } from '@trussworks/react-uswds';
import Select, { components } from 'react-select';
import withWidgetData from './withWidgetData';
import Container from '../components/Container';
import arrowBoth from '../images/arrow-both.svg';
import DateTime from '../components/DateTime';

export function filterData(data, selectedSpecialists) {
  return data.filter((dataPoint) => {
    if (selectedSpecialists.length > 0) {
      let include = false;

      // eslint-disable-next-line consistent-return
      selectedSpecialists.forEach((specialist) => {
        if (dataPoint.participants.includes(specialist.label)) {
          include = true;
        }
      });

      return include;
    }
    return true;
  });
}

export function sortData(data, order) {
  data.sort((a, b) => {
    if (order === 'desc') {
      return b.count - a.count;
    }

    return a.count - b.count;
  });
}

/**
 *
 * Takes a string, a reason (or topic, if you prefer)
 * provided for an activity report and intersperses it with line breaks
 * depending on the length
 *
 * @param {string} reason
 * @returns string with line breaks
 */
export function reasonsWithLineBreaks(reason) {
  const arrayOfReasons = reason.split(' ');

  return arrayOfReasons.reduce((accumulator, currentValue) => {
    const lineBreaks = accumulator.match(/<br \/>/g);
    const allowedLength = lineBreaks ? lineBreaks.length * 6 : 6;

    // we don't want slashes on their own lines
    if (currentValue === '/') {
      return `${accumulator} ${currentValue}`;
    }

    if (accumulator.length > allowedLength) {
      return `${accumulator}<br />${currentValue}`;
    }

    return `${accumulator} ${currentValue}`;
  }, '');
}

/**
 * This is a component for use inside the react select, to match the USDS look
 * https://react-select.com/components
 */
export const DropdownIndicator = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <components.DropdownIndicator {...props}>
    <img aria-hidden="true" alt="" style={{ width: '8px' }} src={arrowBoth} />
  </components.DropdownIndicator>
);

/**
 * this is the styles object for react select
 * https://react-select.com/styles
 * */

const styles = {
  container: (provided, state) => {
    // To match the focus indicator provided by uswds
    const outline = state.isFocused ? '0.25rem solid #2491ff;' : '';
    return {
      ...provided,
      outline,
      height: '40px',
    };
  },
  control: (provided, state) => ({
    height: '40px',
    ...provided,
    borderColor: '#565c65',
    backgroundColor: 'white',
    borderRadius: '0',
    '&:hover': {
      borderColor: '#565c65',
    },
    // Match uswds disabled style
    opacity: state.isDisabled ? '0.7' : '1',
    width: '180px',
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: 0,
    top: 'auto',
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    // The arrow dropdown icon is too far to the right, this pushes it back to the left
    marginRight: '4px',
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  valueContainer: (provided) => ({ ...provided, height: '40px' }),
};

export function ArGraphWidget({ data, dateTime }) {
  // the order the data is displayed in the chart
  const [order, setOrder] = useState('desc');
  // this is for populating the select box
  const [participants, setParticipants] = useState([]);
  // this is the actual selected specialists to filter on
  const [selectedSpecialists, setSelectedSpecialists] = useState([]);
  // the dom el for drawing the chart
  const bars = useRef();

  useEffect(() => {
    if (!bars || !data || !Array.isArray(data)) {
      return;
    }

    // here is where we can filter array for participants
    const filteredData = filterData(data, selectedSpecialists);

    // sort the api response based on the dropdown choices
    sortData(filteredData, order);

    const reasons = [];
    const counts = [];
    let dpParticipants = [];

    filteredData.forEach((dataPoint) => {
      reasons.push(dataPoint.reason);
      counts.push(dataPoint.count);
      dpParticipants = [...dpParticipants, ...dataPoint.participants];
    });

    setParticipants(Array.from(new Set(dpParticipants)));

    const trace = {
      type: 'bar',
      x: reasons.map((reason) => reasonsWithLineBreaks(reason)),
      y: counts,
      hoverinfo: 'y',
    };

    const width = reasons.length > 10 ? reasons.length * 100 : 'auto';

    const layout = {
      height: 480,
      hoverlabel: {
        bgcolor: '#000',
      },
      width,
      margin: {
        l: 0,
        pad: 20,
      },
      xaxis: {
        automargin: true,
        tickangle: 0,
      },
      // hovermode: 'y',
    };

    // draw the plot
    Plotly.newPlot(bars.current, [trace], layout, { displayModeBar: false });
  }, [data, order, selectedSpecialists]);

  if (!data) {
    return <p>Loading...</p>; // test
  }

  // handle the order select
  const handleSelect = (e) => {
    setOrder(e.target.value); // test
  };

  // options for the multiselect
  const options = participants.map((participant, index) => ({
    label: participant,
    value: index + 1,
  }));

  return (
    <Container className="overflow-x-scroll">
      <Grid row>
        <Grid col={4}><h2>Topics in Activity Report by Frequency</h2></Grid>
        <Grid col="auto" className="display-flex padding-x-2 flex-align-self-center">
          <DateTime classNames="display-flex flex-align-center padding-x-1" timestamp={dateTime.dateInExpectedFormat} label={dateTime.prettyPrintedQuery} />
        </Grid>
        <Grid col="auto" className="display-flex padding-x-2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="usa-label sr-only" htmlFor="arGraphOrder">Change topic data order</label>
          <select className="usa-select" id="arGraphOrder" name="arGraphOrder" value={order} onChange={handleSelect}>
            <option value="desc">High To Low</option>
            <option value="asc">Low to High</option>
          </select>
        </Grid>
        <Grid col="auto" className="display-flex padding-x-2">
          <Select
            id="arGraphSpecialists"
            value={selectedSpecialists}
            onChange={(selected) => {
              setSelectedSpecialists(selected); // test
            }}
            className="margin-top-1 ttahub-dashboard--participant-select"
            components={DropdownIndicator}
            options={options}
            tabSelectsValue={false}
            placeholder="Select specialists"
            isMulti
            isClearable={false}
            styles={styles}
          />
        </Grid>
      </Grid>
      <div ref={bars} />
    </Container>
  );
}

ArGraphWidget.propTypes = {
  dateTime: PropTypes.shape({
    dateInExpectedFormat: PropTypes.string, prettyPrintedQuery: PropTypes.string,
  }),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      reason: PropTypes.string,
      count: PropTypes.number,
      participants: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
};

ArGraphWidget.defaultProps = {
  dateTime: { dateInExpectedFormat: '', prettyPrintedQuery: '' },
};

export default withWidgetData(ArGraphWidget, 'arGraph');
