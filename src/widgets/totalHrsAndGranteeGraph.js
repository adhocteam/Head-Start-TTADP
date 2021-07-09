import { Op } from 'sequelize';
import {
  ActivityReport, ActivityRecipient, Grant, sequelize
} from '../models';
import { REPORT_STATUSES } from '../constants';

export default async function totalHrsAndGranteeGraph(scopes) {

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
  });
 

  // 'startDate.win': '2000/01/01-2000/01/01'

  console.log(scopes[0]);
 
  return reports;
}