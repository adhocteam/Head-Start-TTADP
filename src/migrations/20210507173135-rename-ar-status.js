module.exports = {
  up: async (queryInterface) => queryInterface.sequelize.transaction((transaction) => (
    Promise.all([
      queryInterface.renameColumn('ActivityReports', 'status', 'submissionStatus', { transaction }),
      queryInterface.renameColumn('ActivityReports', 'approvingManagerId', 'oldApprovingManagerId', { transaction }),
      queryInterface.renameColumn('ActivityReports', 'managerNotes', 'oldManagerNotes', { transaction }),
    ])
  )),

  down: async (queryInterface) => queryInterface.sequelize.transaction((transaction) => (
    Promise.all([
      queryInterface.renameColumn('ActivityReports', 'submissionStatus', 'status', { transaction }),
      queryInterface.renameColumn('ActivityReports', 'oldApprovingManagerId', 'approvingManagerId', { transaction }),
      queryInterface.renameColumn('ActivityReports', 'oldManagerNotes', 'managerNotes', { transaction }),
    ])
  )),
};
