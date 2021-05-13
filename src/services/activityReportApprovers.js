import { ActivityReportApprover } from '../models';

// eslint-disable-next-line import/prefer-default-export
export function upsertApprover(values, condition) {
  const foundApproval = ActivityReportApprover.findOne({ where: condition });
  if (foundApproval) { // Manager assigned to review by new "multiple approver" method
    return ActivityReportApprover.update(values, { where: condition });
  } // Manager assigned to review by old "single approver" method
  return ActivityReportApprover.create(values);
}
