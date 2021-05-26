import { Op } from 'sequelize';
import {
  ActivityReport, ActivityRecipient, Grant, Grantee, NonGrantee, sequelize,
} from '../models';
/*
  Widgets on the backend should only have to worry about fetching data in the format required
  by the widget. In this case we return a single object but other widgets my require an array
  (say for a time series). All widgets will need to honor the scopes that are passed in. All
  that is required is that the scopes parameter is used as value for the `where` parameter (or
  combined with [op.and] if the widget needs to add additional conditions to the query).

  If adding a new widget be sure to add the widget to ./index.js
*/
export default async function overview(scopes, region) {
  const sumFn = (field, where = {}) => sequelize.literal(`COALESCE(SUM(${field}) FILTER ${where}, 0)`);

  const grantsWhere = `WHERE "status" = 'Active' AND "regionId" in (${region})`;
  const trainingWhere = '(WHERE "ttaType" = \'{"training"}\')';
  const taWhere = '(WHERE "ttaType" = \'{"technical-assistance"}\')';
  const ttaWhere = '(WHERE "ttaType" = \'{"training", "technical-assistance"}\')';

  const res = await ActivityReport.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"ActivityReport".id'))), 'numReports'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"activityRecipients->grant->grantee"."id"'))), 'numGrantees'],
      [sequelize.literal(`(SELECT COUNT(*) from "Grants" ${grantsWhere})`), 'numTotalGrantees'],
      [sequelize.fn('SUM', sequelize.col('numberOfParticipants')), 'numParticipants'],
      [sumFn('duration', trainingWhere), 'sumTrainingDuration'],
      [sumFn('duration', taWhere), 'sumTaDuration'],
      [sumFn('duration', ttaWhere), 'sumDuration'],
    ],
    where: { [Op.and]: [scopes, { legacyId: null }] },
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
            include: [{
              model: Grantee,
              attributes: [],
              as: 'grantee',
            }],
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
