/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import fetchWidget from '../fetchers/Widgets';

/*
  `withWidgetData` wraps widgets providing the widget with data
  when successfully retrieved from the API. It handles error and
  loading states and (only temporarily) accepts loading and error
  overrides so loading and error states can be worked on.
*/
const withWidgetData = (Widget, widgetId) => {
  const WidgetWrapper = (props) => {
    const [loading, updateLoading] = useState(true);
    const [error, updateError] = useState('');
    const [data, updateData] = useState({});

    const { filters, loadingOverride, errorOverride } = props;

    useEffect(() => {
      const fetch = async () => {
        try {
          updateLoading(true);
          const fetchedData = await fetchWidget(widgetId, filters);
          updateData(fetchedData);
          updateError('');
        } catch (e) {
          updateError('Unable to load widget');
        } finally {
          updateLoading(false);
        }
      };
      fetch();
    }, [filters]);

    if (loading || loadingOverride) {
      return (
        <div>
          loading...
        </div>
      );
    }

    if (error || errorOverride) {
      return (
        <div>
          {error || 'Errors set to always show'}
        </div>
      );
    }

    return <Widget data={data} {...props} />;
  };

  WidgetWrapper.propTypes = {
    filters: PropTypes.string.isRequired,
    errorOverride: PropTypes.bool,
    loadingOverride: PropTypes.bool,
  };

  WidgetWrapper.defaultProps = {
    errorOverride: false,
    loadingOverride: false,
  };

  return WidgetWrapper;
};

export default withWidgetData;