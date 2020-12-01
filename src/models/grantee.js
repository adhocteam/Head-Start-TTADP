const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Grantee extends Model {
    static associate(models) {
      Grantee.belongsToMany(models.Goal, { through: models.Ttaplan, foreignKey: 'granteeId', as: 'goals' });
    }
  }
  Grantee.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Grantee',
  });
  return Grantee;
};
