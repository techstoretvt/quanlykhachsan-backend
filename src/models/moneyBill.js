'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class moneyBills extends Model {

    static associate(models) {
      // define association here

    }
  }
  moneyBills.init({
    year: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    money: DataTypes.DOUBLE,
    type: DataTypes.STRING

  }, {
    sequelize,
    modelName: 'moneyBills',
  });
  return moneyBills;
};