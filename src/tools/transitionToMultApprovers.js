import { Op } from 'sequelize';

import { REPORT_STATUSES } from '../constants';
import { auditLogger } from '../logger';
import { ActivityReport, ActivityReportApprover } from '../models';

const transitionToMultApprovers = async () => {
  const reviewedReports = await ActivityReport.findAll({
    raw: true,
    attributes: [
      ['id', 'activityReportId'],
      ['submissionStatus', 'status'],
      ['oldManagerNotes', 'note'],
      ['oldApprovingManagerId', 'userId'],
    ],
    where: {
      submissionStatus: {
        [Op.or]: [REPORT_STATUSES.APPROVED, REPORT_STATUSES.NEEDS_ACTION],
      },
    },
  });

  const submittedReports = await ActivityReport.findAll({
    raw: true,
    attributes: [
      ['id', 'activityReportId'],
      ['oldApprovingManagerId', 'userId'],
    ],
    where: {
      submissionStatus: {
        [Op.or]: [REPORT_STATUSES.SUBMITTED],
      },
    },
  });

  const approvals = reviewedReports.concat(submittedReports);
  auditLogger.info(`Found ${approvals.length} approvals to create.`);

  const createdApprovals = await ActivityReportApprover.bulkCreate(
    approvals,
    { individualHooks: true },
  );
  auditLogger.info(`Created ${createdApprovals.length} approvals.`);

  return createdApprovals;
};

export default transitionToMultApprovers;
