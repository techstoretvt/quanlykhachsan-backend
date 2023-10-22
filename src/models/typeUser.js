'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class typeUser extends Model {

    static associate(models) {
      // define association here
    }
  }
  typeUser.init({
    nameType: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'typeUser',
  });
  return typeUser;
};