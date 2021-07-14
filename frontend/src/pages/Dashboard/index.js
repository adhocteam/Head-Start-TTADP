import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { v4 as uuidv4 } from 'uuid';
import { Grid, GridContainer } from '@trussworks/react-uswds';
import RegionDisplay from './components/RegionDisplay';
import DateSelect from './components/DateSelect';
import Container from '../../components/Container';
import DateRangeSelect from './components/DateRangeSelect';
import DashboardOverview from '../../widgets/DashboardOverview';
import ArGraph from '../../widgets/ArGraph';
import { getUserRegions } from '../../permissions';
import { formatDateRange, CUSTOM_DATE_RANGE } from './constants';
import ReasonList from '../../widgets/ReasonList';
import TotalHrsAndGrantee from '../../widgets/TotalHrsAndGranteeGraph';
import './index.css';

function Dashboard({ user }) {
  const [appliedRegion, updateAppliedRegion] = useState(0);
  const [regions, updateRegions] = useState([]);
  const [regionsFetched, updateRegionsFetched] = useState(false);
  const [selectedDateRangeOption, updateSelectedDateRangeOption] = useState(1);
  const [hasCentralOffice, updateHasCentralOffice] = useState(false);
  const [dateRange, updateDateRange] = useState('');
  const [gainFocus, setGainFocus] = useState(false);
  const [dateTime, setDateTime] = useState({ timestamp: '', label: '' });
  const [dateRangeLoaded, setDateRangeLoaded] = useState(false);

  /*
    *    the idea is that this filters variable, which roughly matches
    *    the implementation on the landing page,
    *    would be passed down into each visualization
    */

  const [filters, updateFilters] = useState([]);

  /**
   * sets whether a user has central office(14) amongst their permissions
   */
  useEffect(() => {
    if (user) {
      updateHasCentralOffice(!!user.permissions.find((permission) => permission.regionId === 14));
    }
  }, [user]);

  /**
  * if a user has not applied a region, we apply the first region
  * if they have central office, we apply that instead
  */
  useEffect(() => {
    if (appliedRegion === 0) {
      if (hasCentralOffice) {
        updateAppliedRegion(14);
      } else if (regions[0]) {
        updateAppliedRegion(regions[0]);
      }
    }
  }, [appliedRegion, hasCentralOffice, regions]);

  // if the regions have been fetched, this smooths out errors around async fetching
  // of regions vs rendering
  useEffect(() => {
    if (!regionsFetched && regions.length < 1) {
      updateRegionsFetched(true);
      updateRegions(getUserRegions(user));
    }
  }, [regions, regionsFetched, user]);

  useEffect(() => {
    /**
     *
     * format the date range for display
     */

    const timestamp = formatDateRange({
      lastThirtyDays: selectedDateRangeOption === 1,
      forDateTime: true,
      string: dateRange,
    });
    const label = formatDateRange({
      lastThirtyDays: selectedDateRangeOption === 1,
      withSpaces: true,
      string: dateRange,
    });

    setDateTime({ timestamp, label });
  }, [selectedDateRangeOption, dateRange]);

  useEffect(() => {
    if (!dateRangeLoaded) {
      updateDateRange(formatDateRange({
        lastThirtyDays: selectedDateRangeOption === 1,
        forDateTime: true,
      }));

      setDateRangeLoaded(true);
    }
  }, [dateRangeLoaded, selectedDateRangeOption]);

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

    updateFilters(filtersToApply);
  },
  [appliedRegion, dateRange, user]);

  const onApplyRegion = (region) => {
    const regionId = region ? region.value : appliedRegion;
    updateAppliedRegion(regionId);
  };

  const onApplyDateRange = (range) => {
    const rangeId = range ? range.value : selectedDateRangeOption;
    updateSelectedDateRangeOption(rangeId);

    const isCustom = selectedDateRangeOption === CUSTOM_DATE_RANGE;

    if (!isCustom) {
      updateDateRange(formatDateRange({ lastThirtyDays: true, forDateTime: true }));
    }

    if (isCustom) {
      // set focus to DateRangePicker 1st input
      setGainFocus(true);
    }
  };

  if (!user) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div className="ttahub-dashboard">
      <Helmet titleTemplate="%s - Dashboard - TTA Smart Hub" defaultTitle="TTA Smart Hub - Dashboard" />

      <>
        <Helmet titleTemplate="%s - Dashboard - TTA Smart Hub" defaultTitle="TTA Smart Hub - Dashboard" />
        <div className="ttahub-dashboard--filter-row flex-fill display-flex flex-align-center flex-align-self-center flex-row flex-wrap">
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
              dateTime={dateTime}
            />
          </div>
        </div>
        <GridContainer className="margin-0 padding-0">
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
                dateTime={dateTime}
              />
            </Grid>
            <Grid col={7}>
              <Container className="ttahub-coming-soon shadow-2 display-flex" padding={3}>
                <TotalHrsAndGrantee
                  filters={filters}
                  region={appliedRegion}
                  allRegions={regions}
                  dateRange={dateRange}
                  skipLoading
                  dateTime={dateTime}
                />
              </Container>
            </Grid>
          </Grid>
          <Grid row>
            <ArGraph
              filters={filters}
              region={appliedRegion}
              allRegions={regions}
              dateRange={dateRange}
              skipLoading
              dateTime={dateTime}
            />
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
