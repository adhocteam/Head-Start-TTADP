import { APPROVER_STATUSES, REPORT_STATUSES } from '../constants';

const { Model } = require('sequelize');

function calculateStatus(approvals) {
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
        const report = await sequelize.models.ActivityReport.findByPk(
          instance.activityReportId,
          { transaction },
        );

        let calculatedStatus;
        switch (instance.status) {
          case APPROVER_STATUSES.NEEDS_ACTION: {
            calculatedStatus = REPORT_STATUSES.NEEDS_ACTION;
            break;
          }
          case APPROVER_STATUSES.APPROVED: {
            const approverStatuses = await sequelize.models.ActivityReportApprover.findAll(
              {
                attributes: ['status'],
                raw: true,
                where: {
                  activityReportId: instance.activityReportId,
                },
              },
              { transaction },
            ).map((a) => a.status);
            calculatedStatus = calculateStatus(approverStatuses);
            break;
          }
          default: {
            calculatedStatus = REPORT_STATUSES.SUBMITTED;
            break;
          }
        }

        report.calculatedStatus = calculatedStatus;
        await report.save();
      },
    },
    sequelize,
    modelName: 'ActivityReportApprover',
  });
  return ActivityReportApprover;
};
