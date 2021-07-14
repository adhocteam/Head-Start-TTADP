import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js-basic-dist';
import { Grid } from '@trussworks/react-uswds';
import withWidgetData from './withWidgetData';
import DateTime from '../components/DateTime';
import './TotalHrsAndGranteeGraph.css';

export function Tooltip(props) {
  const {
    show, x, y, text,
  } = props;
  return show ? <span className="ttahub--total-hrs-grantee-graph-tooltip" style={{ left: x, top: y - 50 }}>{text}</span> : null;
}

Tooltip.propTypes = {
  show: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  text: PropTypes.number.isRequired,
};

export function TotalHrsAndGranteeGraph({ data, dateTime }) {
  // whether or not to show the tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  // set x position of tooltip
  const [tooltipX, setTooltipX] = useState(0);
  // set y position of tooltip
  const [tooltipY, setTooltipY] = useState(0);
  // set tooltip text
  const [tooltipText, setTooltipText] = useState('1');

  // the dom el for drawing the chart
  const lines = useRef();

  useEffect(() => {
    if (!lines || !data || !Array.isArray(data)) {
      return;
    }

    /*
      Data: The below is a breakdown of the Traces widget data array.
      data[0]: Grantee Rec TTA
      data[1]: Hours of Training
      data[2]: Hours of Technical Assistance
      data[3]: Hours of Both
    */
    const traces = [
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: data[0].x,
        y: data[0].y,
        hovertemplate: '<extra></extra>',
        hoverinfo: 'y',
        line: {
          dash: 'dot',
          width: 3,
          color: '#0166ab',
        },
        marker: {
          size: 7,
        },
      },
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: data[1].x,
        y: data[1].y,
        hovertemplate: '<extra></extra>',
        hoverinfo: 'y',
        line: {
          dash: 'solid',
          width: 3,
          color: '#e29f4d',
        },
        marker: {
          size: 7,
        },
      },
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: data[2].x,
        y: data[2].y,
        hovertemplate: '<extra></extra>',
        hoverinfo: 'y',
        line: {
          dash: 'solid',
          width: 3,
          color: '#264a64',
        },
        marker: {
          size: 7,
        },
      },
      {
        type: 'scatter',
        mode: 'lines+markers',
        x: data[3].x,
        y: data[3].y,
        hovertemplate: '<extra></extra>',
        hoverinfo: 'y',
        line: {
          dash: 'solid',
          width: 3,
          color: '#148439',
        },
        marker: {
          size: 7,
        },
      },

    ];

    const width = 760;

    // Specify Chart Layout.
    const layout = {
      height: 300,
      hoverlabel: {
        bgcolor: '#fff',
        bordercolor: '#fff',
        font: {
          color: '#fff',
        },
      },
      margin: {
        l: 50,
        t: 0,
        pad: 20,
        r: 0,
        b: 35,
      },
      width,
      showlegend: false,
      xaxis: {
        showgrid: false,
        b: 0,
        t: 0,
      },
      hovermode: 'none',
    };

    // draw the plot
    Plotly.newPlot(lines.current, traces, layout, { displayModeBar: false, hovermode: 'none' });

    lines.current.on('plotly_hover', (e) => {
      if (e.points && e.points[0]) {
        const rect = lines.current.querySelectorAll(`.trace${e.points[0].fullData.uid} .point`)[e.points[0].pointIndex].getBoundingClientRect();
        const x = rect.left - 12;
        const y = rect.top;
        setShowTooltip(true);
        setTooltipX(x);
        setTooltipY(y);
        setTooltipText(e.points[0].data.y[0]);
      }
    });

    lines.current.on('plotly_unhover', () => {
      setShowTooltip(false);
    });
  }, [data]);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ttahub--total-hrs-grantee-graph">
      <Grid row className="position-relative">
        <Tooltip show={showTooltip} x={tooltipX} y={tooltipY} text={tooltipText} />
        <Grid col="auto"><h3 className="margin-0">Total Hours of TTA and Number of Grants Served</h3></Grid>
        <Grid col="auto" className="display-flex padding-x-2 flex-align-self-center">
          <DateTime classNames="display-flex flex-align-center padding-x-1" timestamp={dateTime.timestamp} label={dateTime.label} />
        </Grid>
      </Grid>

      <div className="position-relative margin-top-1 margin-bottom-3 ttahub--total-hrs-grantee-graph-legend">
        <span>Technical Assistance</span>
        <span>Training</span>
        <span>Both</span>
        <span>Grants</span>
      </div>
      <div data-testid="lines" ref={lines} />
    </div>
  );
}

TotalHrsAndGranteeGraph.propTypes = {
  dateTime: PropTypes.shape({
    timestamp: PropTypes.string, label: PropTypes.string,
  }),
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        x: PropTypes.arrayOf(PropTypes.string),
        y: PropTypes.arrayOf(PropTypes.number),
      }),
    ), PropTypes.shape({}),
  ]).isRequired,
};

TotalHrsAndGranteeGraph.defaultProps = {
  dateTime: { timestamp: '', label: '' },
};
export default withWidgetData(TotalHrsAndGranteeGraph, 'totalHrsAndGranteeGraph');
