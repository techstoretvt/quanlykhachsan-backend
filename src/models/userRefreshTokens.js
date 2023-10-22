'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userRefreshTokens extends Model {

    static associate(models) {
      // define association here
      userRefreshTokens.belongsTo(models.User, { foreignKey: 'idUser' })
    }
  }
  userRefreshTokens.init({

    idUser: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    device_id: DataTypes.STRING,


  }, {
    sequelize,
    modelName: 'userRefreshTokens',
  });
  return userRefreshTokens;
};