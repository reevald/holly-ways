'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: 'userId',
        // 'CASCADE' configures our model so that if a user is deleted, the user’s funds will be deleted too.
        onDelete: 'CASCADE'
      });
      this.belongsTo(models.fund, {
        foreignKey: 'fundId',
        // 'CASCADE' configures our model so that if a user is deleted, the user’s funds will be deleted too.
        onDelete: 'CASCADE'
      });
    }
  };
  payment.init({
    donateAmount: DataTypes.DOUBLE,
    status: DataTypes.STRING,
    proofAttachment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'payment',
  });
  return payment;
};