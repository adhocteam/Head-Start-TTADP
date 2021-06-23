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
      // I'll need an afterCreate hook too
      afterUpsert: async (instances, options) => {
        console.log('[Approver afterUpsert]');
        const instance = instances[0]; // we'll need to loop here
        const report = await sequelize.models.ActivityReport.findOne({
          where: { id: instance.activityReportId },
          transaction: options.transaction,
        });

        let calculatedStatus;
        switch (instance.status) {
          case APPROVER_STATUSES.NEEDS_ACTION: {
            console.log('- [Approver afterUpsert hook] got NEEDS_ACTION');
            calculatedStatus = REPORT_STATUSES.NEEDS_ACTION;
            break;
          }
          case APPROVER_STATUSES.APPROVED: {
            console.log('- [Approver afterUpsert hook] got APPROVED');
            const approverStatuses = await sequelize.models.ActivityReportApprover.findAll(
              {
                attributes: ['status'],
                raw: true,
                where: {
                  activityReportId: instance.activityReportId,
                },
                transaction: options.transaction,
              },
            ).map((a) => a.status);
            calculatedStatus = calculateStatus(approverStatuses);
            break;
          }
          default: {
            console.log('- [Approver afterUpsert hook] got something else');
            calculatedStatus = REPORT_STATUSES.SUBMITTED;
            break;
          }
        }

        report.calculatedStatus = calculatedStatus;
        await report.save();
        console.log('- [Approver afterUpsert hook] stored calculateStatus', report.calculatedStatus);
      },
    },
    sequelize,
    modelName: 'ActivityReportApprover',
  });
  return ActivityReportApprover;
};
