import { APPROVER_STATUSES } from '../constants';

const { Model } = require('sequelize');

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
    sequelize,
    modelName: 'ActivityReportApprover',
  });
  return ActivityReportApprover;
};
