import { Op } from 'sequelize';
import {
  ActivityReport, ActivityRecipient, Grant, NonGrantee, sequelize,
} from '../models';
/*
  Widgets on the backend should only have to worry about fetching data in the format required
  by the widget. In this case we return a single object but other widgets my require an array
  (say for a time series). All widgets will need to honor the scopes that are passed in. All
  that is required is that the scopes parameter is used as value for the `where` parameter (or
  combined with [op.and] if the widget needs to add additional conditions to the query).
*/
export default async function dashboardOverview(scopes, region) {
  // const grantsWhere = `WHERE "status" = 'Active' AND "regionId" in (${region})`;
  // const trainingWhere = '"ttaType" = \'{"training"}\'';
  // const taWhere = '"ttaType" = \'{"technical-assistance"}\'';
  const ttaWhere = '"ttaType" = \'{"training", "technical-assistance"}\'';
  // const baseWhere = `WHERE "regionId" IN (${region})
  // AND "legacyId" IS NULL AND "status" != 'deleted'`;
  const baseWhere = `WHERE "regionId" IN (${region}) AND "status" != 'deleted'`;
  // There could be a better way, but using sequelize.literal was the only way I could get correct
  // numbers for SUM
  // FIXME: see if there is a better way to get totals using SUM

  // const legacy = await ActivityReport.findAll(
  //   {
  //     attributes: [
  //       [sequelize.fn('COUNT', sequelize.fn('DISTINCT',
  // sequelize.col('"ActivityReport".id'))), 'numReports'],
  //       [sequelize.fn('COUNT', sequelize.fn('DISTINCT',
  // sequelize.col('"activityRecipients->grant"."id"'))), 'numGrants'],
  //     ],
  //     where: {
  //       legacyId: {
  //         [Op.not]: null,
  //       },
  //     },
  //     raw: true,
  //   },
  // );

  const res = await ActivityReport.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"ActivityReport".id'))), 'numReports'], // (ok) activity reports
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"activityRecipients->grant"."id"'))), 'numGrants'], // (ok) grants served
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"activityRecipients->nonGrantee"."id"'))), 'nonGrantees'], // non-grantees served
      [sequelize.literal(`(SELECT COALESCE(SUM(duration), 0) FROM "ActivityReports" ${baseWhere} AND ${ttaWhere})`), 'sumDuration'], // (ok) hours of TTA
      [sequelize.literal(`(SELECT COALESCE(SUM(duration), 0) FROM "ActivityReports" ${baseWhere} AND "deliveryMethod" = 'in-person')`), 'inPerson'], // (ok) in person activities
    ],
    // where: { [Op.and]: [scopes, { legacyId: null }] },
    where: { [Op.and]: [scopes] },
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

  return res[0];
}
