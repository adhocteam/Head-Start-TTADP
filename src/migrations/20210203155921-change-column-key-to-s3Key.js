module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Files', 'key');
    await queryInterface.addColumn('Files',
      's3Key',
      {
        type: Sequelize.STRING,
        allowNull: false,
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Files', 's3Key');
    await queryInterface.addColumn('Files',
      'key',
      {
        type: Sequelize.STRING,
        allowNull: false,
      });
  },
};
