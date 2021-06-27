import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@trussworks/react-uswds';
import createPlotlyComponent from 'react-plotly.js/factory';
import withWidgetData from './withWidgetData';
import Container from '../components/Container';

// I know this is kind of weird, but CRA/Plot.ly seem to be unwilling to play nice
// (I was getting persistent front end JS crashes trying to directly import
// and compile the component)
// So now this is imported via cross-origin script & helmet
// Here is the GH issue referencing this
// https://github.com/plotly/react-plotly.js/issues/135
const { Plotly } = window;
const Plot = createPlotlyComponent(Plotly);

function Field({ label, data, col }) {
  return (
    <Grid col={col}>
      <span className="text-bold">{label}</span>
      <br />
      {data}
    </Grid>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  col: PropTypes.number,
};

Field.defaultProps = {
  col: 2,
};

function ArGraph({ data }) {
  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <h1>AR Graph</h1>
      <Plot
        data={[{ type: 'bar', x: [1, 2, 3], y: [2, 5, 3] }]}
        layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
      />
    </Container>
  );
}

ArGraph.propTypes = {
  data: PropTypes.shape({
    data: PropTypes.arrayOf(
      PropTypes.shape({
        reason: PropTypes.string,
        count: PropTypes.number,
      }),
    ),
  }).isRequired,
};

export default withWidgetData(ArGraph, 'arGraph');
// export default ArGraph;
