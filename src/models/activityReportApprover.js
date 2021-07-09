import { APPROVER_STATUSES, REPORT_STATUSES } from '../constants';

const { Model } = require('sequelize');

/**
 * Helper function called by calculateReportStatus function
 * Returns calculatedStatus string based on approvals
 * @param {*} approvals - array, status fields of all approvals for current model instance's
 * activity report
 */
function calculateReportStatusFromApprovals(approvals) {
  const approved = (status) => status === APPROVER_STATUSES.APPROVED;
  if (approvals.every(approved)) {
    return REPORT_STATUSES.APPROVED;
  }

  const needsAction = (status) => status === APPROVER_STATUSES.NEEDS_ACTION;
  if (approvals.some(needsAction)) {
    return REPORT_STATUSES.NEEDS_ACTION;
  }

  return REPORT_STATUSES.SUBMITTED;
}

/**
 * Helper function called by model hooks.
 * Returns calculatedStatus string based on approverStatus and approvals
 * @param {*} approverStatus - string, status field of current model instance
 * @param {*} approvals - array, status fields of all approvals for current model instance's
 * activity report
 */
function calculateReportStatus(approverStatus, approvals) {
  switch (approverStatus) {
    case APPROVER_STATUSES.NEEDS_ACTION: {
      return REPORT_STATUSES.NEEDS_ACTION;
    }
    case APPROVER_STATUSES.APPROVED: {
      return calculateReportStatusFromApprovals(approvals);
    }
    default: {
      return REPORT_STATUSES.SUBMITTED;
    }
  }
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
      unique: 'reportApprover',
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: 'reportApprover',
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
        // The following code should match afterUpsert.
        // This can not be abstracted into a function.
        // Begin
        const approverStatuses = await sequelize.models.ActivityReportApprover.findAll({
          attributes: ['status'],
          raw: true,
          where: { activityReportId: instance.activityReportId },
          transaction: options.transaction,
        }).map((a) => a.status);

        const newCalculatedStatus = calculateReportStatus(instance.status, approverStatuses);
        await sequelize.models.ActivityReport.update({
          calculatedStatus: newCalculatedStatus,
        }, {
          where: { id: instance.activityReportId },
          transaction: options.transaction,
          hooks: false,
        });
        // End
      },
      afterUpsert: async (created, options) => {
        // The following is poorly documented in Sequelize:
        // Created is an array. First item in created array is
        // a model instance, second item is boolean indicating
        // if record was newly created (false = updated existing object.)
        const instance = created[0];

        // The following code should match afterCreate.
        // This can not be abstracted into a function.
        // Begin
        const approverStatuses = await sequelize.models.ActivityReportApprover.findAll({
          attributes: ['status'],
          raw: true,
          where: { activityReportId: instance.activityReportId },
          transaction: options.transaction,
        }).map((a) => a.status);

        const newCalculatedStatus = calculateReportStatus(instance.status, approverStatuses);
        await sequelize.models.ActivityReport.update({
          calculatedStatus: newCalculatedStatus,
        }, {
          where: { id: instance.activityReportId },
          transaction: options.transaction,
          hooks: false,
        });
        // End
      },
    },
    sequelize,
    modelName: 'ActivityReportApprover',
  });
  return ActivityReportApprover;
};
