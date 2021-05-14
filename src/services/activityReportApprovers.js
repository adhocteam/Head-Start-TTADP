import { ActivityReportApprover } from '../models';

// eslint-disable-next-line import/prefer-default-export
export async function upsertApprover(values, conditions) {
  const foundApproval = await ActivityReportApprover.findOne({ where: conditions });
  if (foundApproval) { // Manager assigned to review by new "multiple approver" method
    return ActivityReportApprover.update(values, { where: conditions });
  } // Manager assigned to review by old "single approver" method
  return ActivityReportApprover.create({ ...values, ...conditions });
}
