module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn('ActivityReports', 'status', 'submissionStatus');
  },

  down: async (queryInterface) => {
    await queryInterface.renameColumn('ActivityReports', 'submissionStatus', 'status');
  },
};
