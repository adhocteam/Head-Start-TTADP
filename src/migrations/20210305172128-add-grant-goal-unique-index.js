module.exports = {
  up: async (queryInterface) => {
    queryInterface.addIndex('GrantGoals', ['grantId', 'goalId', 'granteeId'], { unique: true });
  },

  down: async (queryInterface) => {
    queryInterface.removeIndex('GrantGoals', ['grantId', 'goalId', 'granteeId']);
  },
};
