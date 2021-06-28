import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js';
import { Grid } from '@trussworks/react-uswds';
import withWidgetData from './withWidgetData';
import Container from '../components/Container';

function ArGraph({ data, dateTime }) {
  const [order, setOrder] = useState('desc');
  const bars = useRef();

  useEffect(() => {
    if (!bars || !data || !Array.isArray(data)) {
      return;
    }

    // sort the api response based on the dropdown choices
    data.sort((a, b) => {
      if (order === 'desc') {
        return b.count - a.count;
      }

      return a.count - b.count;
    });

    const reasons = [];
    const counts = [];

    data.forEach((dataPoint) => {
      reasons.push(dataPoint.reason);
      counts.push(dataPoint.count);
    });

    const trace = {
      type: 'bar',
      x: reasons,
      y: counts,
    };

    const layout = {
      height: 360,
    };

    Plotly.newPlot(bars.current, [trace], layout, { displayModeBar: false });
  }, [data, order]);

  if (!data) {
    return <p>Loading...</p>;
  }

  const handleSelect = (e) => {
    setOrder(e.target.value);
  };

  return (
    <Container>
      <Grid row>
        <Grid col={4}><h2>Topics in Activity Report by Frequency</h2></Grid>
        <Grid col="auto" className="display-flex padding-x-2">{dateTime}</Grid>
        <Grid col="auto" className="display-flex padding-x-2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="usa-label sr-only" htmlFor="arGraphOrder">Change topic data order</label>
          <select className="usa-select" id="arGraphOrder" name="arGraphOrder" value={order} onChange={handleSelect}>
            <option value="desc">High To Low</option>
            <option value="asc">Low to High</option>
          </select>
        </Grid>
        <Grid col="auto" className="display-flex padding-x-2">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="usa-label sr-only" htmlFor="arGraphSpecialists">View specific specialist data</label>
          <select className="usa-select" id="arGraphSpecialists" name="arGraphSpecialists">
            <option value="all">All Specialists</option>
          </select>
        </Grid>
      </Grid>
      <div ref={bars} />
    </Container>
  );
}

ArGraph.propTypes = {
  dateTime: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      reason: PropTypes.string,
      count: PropTypes.number,
      participants: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
};

export default withWidgetData(ArGraph, 'arGraph');
// export default ArGraph;
