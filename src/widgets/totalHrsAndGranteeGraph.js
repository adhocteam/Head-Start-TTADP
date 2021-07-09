import { Op } from 'sequelize';
import moment from 'moment';
import {
  ActivityReport, ActivityRecipient, Grant, sequelize,
} from '../models';
import { REPORT_STATUSES } from '../constants';

function addOrUpdateResponse(traceIndex, res, xValue, valueToAdd) {
  const valueToUse = parseFloat(valueToAdd, 10) === 0 ? 0 : parseFloat(valueToAdd, 10);

  if (res[traceIndex].x.includes(xValue)) {
    // Update existing Y value.
    const indexToUpdate = res[traceIndex].x.indexOf(xValue);
    res[traceIndex].y[indexToUpdate] += valueToUse;
  } else {
    // Add X value and Update Y value.
    res[traceIndex].x.push(xValue);
    res[traceIndex].y.push(valueToUse);
  }
}

export default async function totalHrsAndGranteeGraph(scopes, query) {
  // Get the Date Range.
  const dateRange = query['startDate.win'];
  const dates = dateRange.split('-');

  // Parse out Start and End Date.
  let startDate;
  let endDate;

  let useDays = true;

  // Check if we have a Start Date.
  if (dates.length > 0) {
    // eslint-disable-next-line prefer-destructuring
    startDate = dates[0];
  }

  // Check if we have and End Date.
  if (dates.length > 1) {
    // eslint-disable-next-line prefer-destructuring
    endDate = dates[1];
  }

  // Determine if we have more than 31 days.
  if (startDate && endDate) {
    const sdDate = moment(startDate);
    const edDate = moment(endDate);
    const daysDiff = edDate.diff(sdDate, 'days');
    useDays = daysDiff <= 31;
  }

  // Query Approved AR's.
  const reports = await ActivityReport.findAll({
    attributes: [
      'id',
      'startDate',
      'ttaType',
      'duration',
      [sequelize.col('"activityRecipients->grant"."id"'), 'granteeId'],
    ],
    where: {
      [Op.and]: [scopes],
      status: REPORT_STATUSES.APPROVED,

    },
    raw: true,
    includeIgnoreAttributes: false,
    include: [
      {
        model: ActivityRecipient,
        as: 'activityRecipients',
        attributes: [],
        required: false,
        include: [
          {
            model: Grant,
            as: 'grant',
            attributes: [],
            required: false,
          },
        ],
      },

    ],
    order: [['startDate', 'ASC']],
  });

  // Build out return Graph data.
  const res = [
    { name: 'Grantee Rec TTA', x: [], y: [] },
    { name: 'Hours of Training', x: [], y: [] },
    { name: 'Hours of Technical Assistance', x: [], y: [] },
    { name: 'Hours of Both', x: [], y: [] }];

  const arDates = [];

  reports.forEach((r) => {
    // Get X Axis value to use.
    const xValue = useDays ? moment(r.startDate).format('DD') : moment(r.startDate).format('MMMM');

    // Grantee Rec TTA (every row).
    if (r.granteeId) {
      addOrUpdateResponse(0, res, xValue, 1);
    }

    // Check if we have added this activity report for this date.
    if (!arDates.find((cache) => cache.id === r.id && cache.date === r.startDate)) {
      // Populate Both.
      if (r.ttaType.includes('training') && r.ttaType.includes('technical-assistance')) {
        addOrUpdateResponse(3, res, xValue, r.duration);
      } else if (r.ttaType.includes('training')) {
        // Hours of Training.
        addOrUpdateResponse(1, res, xValue, r.duration);
      } else {
        // Hours of Technical Assistance.
        addOrUpdateResponse(2, res, xValue, r.duration);
      }

      // Populate used AR Id's and Dates.
      arDates.push({ id: r.id, date: r.startDate });
    }
  });

  return res;
}
