import { Op } from 'sequelize';
import { ActivityReport } from '../models';
import { REPORT_STATUSES } from '../constants';

/*
  Widgets on the backend should only have to worry about fetching data in the format required
  by the widget. In this case we return a single object but other widgets my require an array
  (say for a time series). All widgets will need to honor the scopes that are passed in. All
  that is required is that the scopes parameter is used as value for the `where` parameter (or
  combined with [op.and] if the widget needs to add additional conditions to the query).

  If adding a new widget be sure to add the widget to ./index.js
*/
export default async function reasonList(scopes) {

  console.log('Before Query!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

  // Query Database for all Reason's within the scope.
  const res = await ActivityReport.findAll({
    attributes: [
      'reason',
    ],
    where: {
      [Op.and]: [
        scopes,
        { status: REPORT_STATUSES.APPROVED },
      ],
    },
    raw: true,
    includeIgnoreAttributes: false,
  });

  console.log('After Query!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',res);

  // Get counts for each reason.
  const reasons = [];
  res.forEach((rarr) => {
    rarr.reason.forEach((r) => {
      const reasonObj = reasons.find((e) => e.name === r);
      if (reasonObj) {
        reasonObj.count += 1;
      } else {
        reasons.push({ name: r, count: 1 });
      }
    });
  });

  // Sort By Reason Count largest to smallest.
  reasons.sort((r1, r2) => r2.count - r1.count);

  console.log('After ARRAY!!!!!!!!!!!!!!!!!!!!', reasons.slice(0, 13));

  // Return only top 14.
  return reasons.slice(0, 13);
}
