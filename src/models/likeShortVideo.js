'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likeShortVideos extends Model {

    static associate(models) {
      // define association here
      likeShortVideos.belongsTo(models.shortVideos, { foreignKey: 'idShortVideo' })
    }
  }
  likeShortVideos.init({

    idUser: DataTypes.STRING,
    idShortVideo: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'likeShortVideos',
  });
  return likeShortVideos;
};