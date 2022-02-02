'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Reference: https://levelup.gitconnected.com/creating-sequelize-associations-with-the-sequelize-cli-tool-d83caa902233
      // We also need to change our user model (check /models/user.js)
      this.belongsTo(models.user, {
        foreignKey: 'userId',
        // 'CASCADE' configures our model so that if a user is deleted, the user’s funds will be deleted too.
        onDelete: 'CASCADE'
      });
      this.hasMany(models.payment, {
        foreignKey: 'fundId'
      });
    }
  };
  fund.init({
    title: DataTypes.STRING,
    thumbnail: DataTypes.TEXT,
    goal: DataTypes.DOUBLE,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'fund',
  });
  return fund;
};