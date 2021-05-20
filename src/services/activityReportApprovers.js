import { ActivityReportApprover } from '../models';

// eslint-disable-next-line import/prefer-default-export
export function upsertApprover(values, conditions) {
  const [isUpdated, updatedApprover] = ActivityReportApprover.update(values, {
    returning: true,
    where: conditions,
  });

  if (isUpdated) { // Manager assigned to review by new "multiple approver" method
    return updatedApprover[0];
  }
  return ActivityReportApprover.create({ ...values, ...conditions });
}
