'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class keywordSearchs extends Model {

    static associate(models) {
      // define association here

    }
  }
  keywordSearchs.init({
    keyword: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    stt: DataTypes.INTEGER



  }, {
    sequelize,
    modelName: 'keywordSearchs',
  });
  return keywordSearchs;
};