import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { v4 as uuidv4 } from 'uuid';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import RegionDisplay from './components/RegionDisplay';
import DateSelect from './components/DateSelect';
import DateRangeSelect from './components/DateRangeSelect';
import DashboardOverview from '../../widgets/DashboardOverview';
import { getUserRegions } from '../../permissions';
import { formatDateRange, CUSTOM_DATE_RANGE } from './constants';
import ReasonList from '../../widgets/ReasonList';
import './index.css';

function Dashboard({ user }) {
  const [appliedRegion, updateAppliedRegion] = useState(0);
  const [regions, updateRegions] = useState([]);
  const [regionsFetched, updateRegionsFetched] = useState(false);
  const [selectedDateRangeOption, updateSelectedDateRangeOption] = useState(1);
  const [hasCentralOffice, updateHasCentralOffice] = useState(false);
  const [dateRange, updateDateRange] = useState('');
  const [gainFocus, setGainFocus] = useState(false);
  const [dateRangeLoaded, setDateRangeLoaded] = useState(false);

  /*
    *    the idea is that this filters variable, which roughly matches
    *    the implementation on the landing page,
    *    would be passed down into each visualization
    */

  /* eslint-disable-next-line */
  const [filters, updateFilters] = useState([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    // The number and nature of the filters is static, so we can just update them like so
    const filtersToApply = [
      {
        id: uuidv4(), // note to self- is this just for unique keys/.map?
        topic: 'region',
        condition: 'Is equal to',
        query: appliedRegion,
      },
      {
        id: uuidv4(),
        topic: 'startDate',
        condition: 'Is within',
        query: dateRange,
      },
    ];

    if (!regionsFetched && regions.length < 1) {
      updateRegionsFetched(true);
      updateRegions(getUserRegions(user));
    }

    updateFilters(filtersToApply);
    updateHasCentralOffice(!!user.permissions.find((permission) => permission.regionId === 14));

    if (appliedRegion === 0) {
      if (hasCentralOffice) {
        updateAppliedRegion(14);
      } else if (regions[0]) {
        updateAppliedRegion(regions[0]);
      }
    }

    if (!dateRangeLoaded) {
      updateDateRange(formatDateRange(selectedDateRangeOption, { forDateTime: true }));
      setDateRangeLoaded(true);
    }
  },
  [
    appliedRegion,
    dateRange,
    hasCentralOffice,
    regions,
    user,
    regionsFetched,
    selectedDateRangeOption,
    dateRangeLoaded,
  ]);

  const onApplyRegion = (region) => {
    const regionId = region ? region.value : appliedRegion;
    updateAppliedRegion(regionId);
  };

  const onApplyDateRange = (range) => {
    const rangeId = range ? range.value : selectedDateRangeOption;
    updateSelectedDateRangeOption(rangeId);

    if (selectedDateRangeOption !== CUSTOM_DATE_RANGE) {
      updateDateRange(formatDateRange(selectedDateRangeOption, { forDateTime: true }));
      // set focus to DateRangePicker 1st input
      setGainFocus(true);
    }
  };

  if (!user) {
    return (
      <div>Loading...</div>
    );
  }

  const mainClassNames = 'ttahub-dashboard--filter-row flex-fill display-flex flex-align-center flex-align-self-center flex-row flex-wrap';

  /*
     <ReasonList
                filters={filters}
                region={appliedRegion}
                allRegions={getUserRegions(user)}
                dateRange={dateRange}
                skipLoading
              />
  */

  return (
    <div className="ttahub-dashboard">
      <Helmet titleTemplate="%s - Dashboard - TTA Smart Hub" defaultTitle="TTA Smart Hub - Dashboard" />

      <>
        <Helmet titleTemplate="%s - Dashboard - TTA Smart Hub" defaultTitle="TTA Smart Hub - Dashboard" />
        <div className={appliedRegion === 14 && selectedDateRangeOption === CUSTOM_DATE_RANGE ? `${mainClassNames} all-selected-custom` : mainClassNames}>
          <RegionDisplay
            regions={regions}
            appliedRegion={appliedRegion}
            onApplyRegion={onApplyRegion}
            hasCentralOffice={hasCentralOffice}
          />
          <div className="ttahub-dashboard--date-filters display-flex flex-row flex-align-center">
            <DateRangeSelect
              selectedDateRangeOption={selectedDateRangeOption}
              onApply={onApplyDateRange}
            />
            <DateSelect
              dateRange={dateRange}
              updateDateRange={updateDateRange}
              selectedDateRangeOption={selectedDateRangeOption}
              gainFocus={gainFocus}
            />
          </div>
        </div>
        <GridContainer className="margin-0 margin-top-205 padding-0">
          <DashboardOverview
            filters={filters}
            region={appliedRegion}
            allRegions={regions}
            dateRange={dateRange}
            skipLoading
          />
          <Grid row gap={2}>
            <Grid col={5}>
              <ReasonList
                filters={filters}
                region={appliedRegion}
                allRegions={getUserRegions(user)}
                dateRange={dateRange}
                skipLoading
              />
            </Grid>
            <Grid col={7}>
              <div className="dashboard-overview--widget-grid-coming-soon-one">
                <h3>Coming Soon...</h3>
              </div>
            </Grid>
          </Grid>

          <Grid row>
            <Grid col="auto">
              test 3
            </Grid>
          </Grid>

          <Grid row>
            <Grid col="auto" />
          </Grid>
        </GridContainer>
      </>
    </div>
  );
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    role: PropTypes.arrayOf(PropTypes.string),
    permissions: PropTypes.arrayOf(PropTypes.shape({
      userId: PropTypes.number,
      scopeId: PropTypes.number,
      regionId: PropTypes.number,
    })),
  }),
};

Dashboard.defaultProps = {
  user: null,
};

export default Dashboard;
