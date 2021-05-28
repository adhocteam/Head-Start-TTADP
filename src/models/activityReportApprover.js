import { APPROVER_STATUSES, REPORT_STATUSES } from '../constants';

import { ActivityReportApprover } from '.'
// import ActivityReport from './activityReport'

const { Model } = require('sequelize');

function calculateStatus(report, approvals) {
  // Object for keeping track of all our approvals
  const approvalStatuses = {};

  // For approvals assigned by old "single approver" method,
  // capture pending review.
  if (report.oldApprovingManagerId) {
    approvalStatuses[report.oldApprovingManagerId] = null;
  }

  approvals.forEach((approval) => {
    approvalStatuses[approval.userId] = approval.status;
  });

  // All approvers approved
  const approved = (status) => status === REPORT_STATUSES.APPROVED;
  if (Object.values(approvalStatuses).every(approved)) {
    return REPORT_STATUSES.APPROVED;
  }

  // At least one approver requested edits
  const needsAction = (status) => status === REPORT_STATUSES.NEEDS_ACTION;
  if (Object.values(approvalStatuses).some(needsAction)) {
    return REPORT_STATUSES.NEEDS_ACTION;
  }

  // At least one review is pending
  return REPORT_STATUSES.SUBMITTED;
}

module.exports = (sequelize, DataTypes) => {
  class ActivityReportApprover extends Model {
    static associate(models) {
      ActivityReportApprover.belongsTo(models.ActivityReport, { foreignKey: 'activityReportId', as: 'activityReport' });
      ActivityReportApprover.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  ActivityReportApprover.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    activityReportId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    status: {
      allowNull: true,
      type: DataTypes.ENUM(Object.keys(APPROVER_STATUSES).map((k) => APPROVER_STATUSES[k])),
    },
    note: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
  }, {
    hooks: {
      afterCreate: async (instance, options) => {
        const { transaction } = options;
        const report = await sequelize.models.ActivityReport.findByPk(instance.activityReportId, { transaction: transaction })

        let calculatedStatus
        switch(instance.status) {
          case null:
            calculatedStatus = REPORT_STATUSES.SUBMITTED
          case APPROVER_STATUSES.NEEDS_ACTION:
            calculatedStatus = REPORT_STATUSES.NEEDS_ACTION
          case APPROVER_STATUSES.APPROVED:
            const approvals = await sequelize.models.ActivityReportApprover.findAll({ where: {activityReportId: instance.activityReportId}}, { transaction: transaction })
            calculatedStatus = calculateStatus(report, approvals)
        }

        console.log('[afterCreate] determined calculatedStatus to be >', calculatedStatus)
        report.calculatedStatus = calculatedStatus;
        await report.save();
        await report.reload();
        console.log('[afterCreate] updated report id:', report.id, 'to have calculated status', report.calculatedStatus)
      }
    },
    sequelize,
    modelName: 'ActivityReportApprover',
  });
  return ActivityReportApprover;
};
