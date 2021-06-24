import { Op } from 'sequelize';
import moment from 'moment';
import {
  ActivityReport, ActivityRecipient, Grant, NonGrantee, sequelize,
} from '../models';

export default async function dashboardOverview(scopes, region, date) {
  // we pass the selected date range into the sequelize findAll
  // (if nothing is selected, we get the last thirty days)
  const DATE_FORMAT = 'YYYY-MM-DD';
  const dateRange = date && date.length > 1 ? date.map((day) => day.replace('/', '-')) : [moment().subtract(30, 'days').format(DATE_FORMAT), moment().format(DATE_FORMAT)];
  // Filter by region and status (only approved reports)
  const baseWhere = `WHERE "regionId" IN (${region}) AND "status" = 'approved'`;
  const grantsWhere = `WHERE "status" = 'Active' AND "regionId" in (${region})`;

  // first we need to extract the non grantee participants from the legacy data
  const legacyNonGranteeParticipants = await ActivityReport.findAll({
    attributes: [[sequelize.json('imported.nonGranteeParticipants'), 'nonGranteeParticipants']],
    where: {
      startDate: {
        [Op.gte]: dateRange[0],
        [Op.lte]: dateRange[1],
      },
      legacyId: {
        [Op.ne]: null,
      },
      [Op.and]: [scopes],
      status: {
        [Op.eq]: 'approved',
      },
    },
    raw: true,
  });

  // this is a little bit of garbage, so I'll explain
  const filteredLegacyData = legacyNonGranteeParticipants
    .filter((data) => (data.nonGranteeParticipants !== '')) // filter out the empty ones
    .map((data) => (data.nonGranteeParticipants.split('\n'))) // split on the \n, which is how multiples are concatenated
    .flat(); // flatten the arrays produced in the last operation

  // get all the unique items and turn it back into an array
  // we will use this array in the next step and in our eventual response object
  const uniqueLegacyNonGrantees = Array.from(new Set(filteredLegacyData));

  const res = await ActivityReport.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"ActivityReport".id'))), 'numReports'], // (ok) activity reports
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"activityRecipients->grant"."id"'))), 'numGrants'], // (ok) grants served
      [sequelize.literal(`(SELECT COUNT(*) from "Grants" ${grantsWhere})`), 'numTotalGrants'],
      [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('"activityRecipients->nonGrantee"."id"'))), 'nonGrantees'], // non-grantees served
      [sequelize.literal(`(SELECT COALESCE(SUM(duration), 0) FROM "ActivityReports" ${baseWhere})`), 'sumDuration'], // (ok) hours of TTA
      [sequelize.literal(`(SELECT COALESCE(SUM(duration), 0) FROM "ActivityReports" ${baseWhere} AND "deliveryMethod" = 'in-person')`), 'inPerson'], // (ok) in person activities
    ],
    where: {
      [Op.and]: [scopes],
      startDate: {
        [Op.gte]: dateRange[0],
        [Op.lte]: dateRange[1],
      },
      status: {
        [Op.eq]: 'approved',
      },
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
            where: {
              name: {
                // where the name is not the same as one of the legacy grantees
                [Op.notIn]: Array.from(uniqueLegacyNonGrantees),
              },
            },
          },
        ],
      },
    ],
  });

  return {
    ...res[0],
    // this is a lot to say we are trying to return a string from the sum of a string and an int
    nonGrantees: (uniqueLegacyNonGrantees.length + parseInt(res[0].nonGrantees, 10)).toString(),
  };
}
