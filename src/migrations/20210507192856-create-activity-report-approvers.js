const approverStatuses = [
  'needs_action',
  'approved',
];

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ActivityReportApprovers', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    activityReportId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'ActivityReport',
        },
        key: 'id',
      },
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Users',
        },
        key: 'id',
      },
    },
    status: {
      allowNull: true,
      type: Sequelize.DataTypes.ENUM(...approverStatuses),
    },
    note: {
      allowNull: true,
      type: Sequelize.DataTypes.TEXT,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('ActivityReportApprovers'),
};
