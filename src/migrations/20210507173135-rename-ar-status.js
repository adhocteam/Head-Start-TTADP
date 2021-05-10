'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ActivityReports', 'status', 'submissionStatus', { transaction: t });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ActivityReports', 'submissionStatus', 'status', { transaction: t });
  }
};
