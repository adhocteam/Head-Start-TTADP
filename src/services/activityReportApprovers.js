import { ActivityReportApprover } from '../models';

/**
 * Update or create new Approver
 *
 * @param {*} values - object containing Approver properties to update
 * @param {*} conditions - object containing properties to search for existing Approver
 */
// eslint-disable-next-line import/prefer-default-export
export function upsertApprover(values, conditions) {
  const [isUpdated, updatedApprover] = ActivityReportApprover.update(values, {
    returning: true,
    where: conditions,
  });

  if (isUpdated) { // Manager was assigned to review by new "multiple approver" method
    return updatedApprover[0];
  }
  return ActivityReportApprover.create({ ...values, ...conditions });
}
