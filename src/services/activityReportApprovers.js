import { ActivityReportApprover } from '../models';

/**
 * Update or create new Approver
 *
 * @param {*} values - object containing Approver properties to update
 * @param {*} transaction - sequelize transaction
 */
// eslint-disable-next-line import/prefer-default-export
export async function upsertApprover(values, transaction) {
  const [approver, createdNew] = await ActivityReportApprover.upsert(values, {
    transaction,
    returning: true,
  });
  return approver;
}
