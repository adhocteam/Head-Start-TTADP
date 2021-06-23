const approverStatuses = [
  'needs_action',
  'approved',
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ActivityReportApprovers', {
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
            tableName: 'ActivityReports',
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
    }, {
      uniqueKeys: {
        actions_unique: {
          fields: ['activityReportId', 'userId'],
        },
      },
    });
    await queryInterface.addConstraint('ActivityReportApprovers', ['activityReportId', 'userId'], {
      type: 'unique',
      name: 'unique_activityReportId_userId',
    });
  },
  down: (queryInterface) => queryInterface.dropTable('ActivityReportApprovers'),
};
