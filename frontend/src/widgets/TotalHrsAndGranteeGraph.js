import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Plotly from 'plotly.js-basic-dist';
import { Grid } from '@trussworks/react-uswds';
import withWidgetData from './withWidgetData';
import Container from '../components/Container';
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
    // eslint-disable-next-line no-unused-vars
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

        console.log("DATA!", data);

        const traces = [
            {
                type: 'line',
                x: data[0].x,
                y: data[0].y,
                hoverinfo: 'y',
                line: {
                    dash: 'dot',
                    width: 2,
                    color: '#0166ab',
                }
            }
            ,
            {
                type: 'line',
                x: data[1].x,
                y: data[1].y,
                hoverinfo: 'y',
                line: {
                    dash: 'solid',
                    width: 2,
                    color: '#e29f4d',
                }
            },
            {
                type: 'line',
                x: data[2].x,
                y: data[2].y,
                hoverinfo: 'y',
                line: {
                    dash: 'solid',
                    width: 2,
                    color: '#264a64',
                }
            },
            {
                type: 'line',
                x: data[3].x,
                y: data[3].y,
                hoverinfo: 'y',
                line: {
                    dash: 'solid',
                    width: 2,
                    color: '#148439',
                }
            },


        ];

        // TODO: Write Logic.
        const width = 760;

        // Specify Chart Layout.
        const layout = {
            //height: 344,
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
                // t: 40,
                t: 0,
                pad: 20,
                r: 0,
                b: 35,
            },
            width,
            hovermode: 'none',
            showlegend: false,
            xaxis: {
                showgrid: false,
                b: 0,
                t: 0,
            },
        };

        // draw the plot
        Plotly.newPlot(lines.current, traces, layout, { displayModeBar: false, hovermode: 'none' });

        /*
        lines.current.on('plotly_hover', (e) => {
            if (e.points && e.points[0]) {
                const rect = document.querySelectorAll('.point')[e.points[0].pointIndex].getBoundingClientRect();
                const x = rect.left;
                const y = rect.top;
                setShowTooltip(true);
                setTooltipX(x);
                setTooltipY(y);
                setTooltipText(counts[e.points[0].pointIndex]);
            }
        });

        lines.current.on('plotly_unhover', () => {
            setShowTooltip(false);
        });
        */
    }, [data]);


    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <div className="ttahub--total-hrs-grantee-graph">
            <Grid row className="position-relative">
                <Tooltip show={showTooltip} x={tooltipX} y={tooltipY} text={tooltipText} />
                <Grid col="auto" ><h3 className="margin-0">Total Hours of TTA and Number of Grants Served</h3></Grid>
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
