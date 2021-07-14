import { ActivityReportApprover } from '../models';

/**
 * Update or create new Approver
 *
 * @param {*} values - object containing Approver properties to create or update
 * @param {*} transaction - sequelize transaction
 */
// eslint-disable-next-line import/prefer-default-export
export async function upsertApprover(values, transaction) {
  const [approver] = await ActivityReportApprover.upsert(values, {
    transaction,
    returning: true,
  });
  return approver;
}
