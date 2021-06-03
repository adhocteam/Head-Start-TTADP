import { Op } from 'sequelize';

import { REPORT_STATUSES } from '../constants';
import { auditLogger } from '../logger';
import { ActivityReport, ActivityReportApprover } from '../models';

const transitionToMultApprovers = async () => {
  //
  // Record old 'single approver' records in new ActivityReportApprovers table.
  //

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
  auditLogger.info(`Found ${approvals.length} approval(s) to create.`);

  const createdApprovals = await ActivityReportApprover.bulkCreate(
    approvals,
    { individualHooks: true },
  );
  auditLogger.info(`Created ${createdApprovals.length} approval(s).`);

  //
  // For reports that weren't submitted yet, copy submissionStatus to calculatedStatus
  // so FE can use just calculatedStatus as overall status value.
  //

  const draftReports = await ActivityReport.update(
    { calculatedStatus: REPORT_STATUSES.DRAFT},
    {
      where: { submissionStatus: REPORT_STATUSES.DRAFT },
      hooks: false,
      silent: true,
      returning: true
    },
  )
  auditLogger.info(`Updated calculatedStatus of ${draftReports[0]} draft report(s).`);

  const deletedReports = await ActivityReport.update(
    { calculatedStatus: REPORT_STATUSES.DELETED},
    {
      where: { submissionStatus: REPORT_STATUSES.DELETED },
      hooks: false,
      silent: true,
      returning: true,
    },
  )
  auditLogger.info(`Updated calculatedStatus of ${deletedReports[0]} deleted report(s).`);

};

export default transitionToMultApprovers;
