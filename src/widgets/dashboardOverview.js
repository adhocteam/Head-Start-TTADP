import { Op } from 'sequelize';

import {
  ActivityReport, ActivityRecipient, Grant, NonGrantee, sequelize,
} from '../models';
import { REPORT_STATUSES } from '../constants';

export default async function dashboardOverview(scopes, query) {
  const { region } = query;

  let regions = region ? [region] : [0];

  if ('region.in' in query) {
    if (Array.isArray(query['region.in'])) {
      const regionsFromQuery = query['region.in'];
      regions = regionsFromQuery;
    }
  }

  const grantsWhere = `WHERE "status" = 'Active' AND "regionId" in (${regions.join(',')})`;

  const duration = await ActivityReport.findAll({
    attributes: [
      'duration',
      'deliveryMethod',
    ],
    where: {
      [Op.and]: [scopes],
      status: REPORT_STATUSES.APPROVED,

    },
    raw: true,
    includeIgnoreAttributes: false,
  });

  // eslint-disable-next-line max-len
  const sumDuration = duration.reduce((acc, report) => acc + (report.duration ? parseFloat(report.duration) : 0), 0)
    .toFixed(1)
    .toString();

  const inPerson = duration.filter((report) => report.deliveryMethod === 'in-person')
    .reduce((acc, report) => (
      acc + parseFloat(report.duration)
    ), 0)
    .toFixed(1)
    .toString();

  const res = await ActivityReport.findAll({
    attributes: [
      // This is a literal because it needs to *not* respect the scopes passed in
      [sequelize.literal(`(SELECT COUNT(*) from "Grants" ${grantsWhere})`), 'numTotalGrants'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"ActivityReport".id'))), 'numReports'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"activityRecipients->grant"."id"'))), 'numGrants'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"activityRecipients->nonGrantee"."id"'))), 'nonGrantees'],
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
            where: {
              [Op.and]: [scopes],
            },
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
    // inPerson: inPersonDuration[0].sum,
    inPerson,
    sumDuration,
  };
}
