import { Op } from 'sequelize';

import {
  ActivityReport, ActivityRecipient, Grant, NonGrantee, sequelize,
} from '../models';
import { REPORT_STATUSES } from '../constants';

export default async function dashboardOverview(scopes, region) {
  // we pass the selected date range into the sequelize findAll
  // (if nothing is selected, we get the last thirty days)
  // const DATE_FORMAT = 'YYYY-MM-DD';
  // const dateRange = date && date.length > 1 ? date.map((day) => day.replace('/', '-')) :
  // [moment().subtract(30, 'days').format(DATE_FORMAT), moment().format(DATE_FORMAT)];
  // Filter by region and status (only approved reports)
  const grantsWhere = `WHERE "status" = 'Active' AND "regionId" in (${region})`;

  const inPersonDuration = await ActivityReport.findAll({
    attributes: [
      [sequelize.fn('SUM', sequelize.col('duration')), 'sumDuration'],
    ],
    where: {
      status: REPORT_STATUSES.APPROVED,
      deliveryMethod: {
        [Op.eq]: 'in-person',
      },
    },
    raw: true,
    // without 'includeIgnoreAttributes' the attributes from the join table
    // "activityReportObjectives" are included which causes postgres to error when
    // those attributes are not aggregated or used in a group by (since all the
    // other DB fields are aggregated)
    includeIgnoreAttributes: false,
  });

  const res = await ActivityReport.findAll({
    attributes: [
      // This is a literal because it needs to *not* respect the scopes passed in
      [sequelize.literal(`(SELECT COUNT(*) from "Grants" ${grantsWhere})`), 'numTotalGrants'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"ActivityReport".id'))), 'numReports'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"activityRecipients->grant"."id"'))), 'numGrants'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"activityRecipients->nonGrantee"."id"'))), 'nonGrantees'],
      [sequelize.fn('SUM', sequelize.col('duration')), 'sumDuration'],
    ],
    where: {
      [Op.and]: [scopes],
      status: REPORT_STATUSES.APPROVED,
    },
    raw: true,
    // without 'includeIgnoreAttributes' the attributes from the join table
    // "activityReportObjectives" are included which causes postgres to error when
    // those attributes are not aggregated or used in a group by (since all the
    // other DB fields are aggregated)
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
          {
            model: NonGrantee,
            attributes: [],
            as: 'nonGrantee',
            required: false,
          },
        ],
      },
    ],
  });

  return {
    ...res[0],
    inPerson: inPersonDuration[0].sumDuration,
  };
}
