'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class collectionShortVideos extends Model {

    static associate(models) {
      // define association here
      collectionShortVideos.belongsTo(models.User, { foreignKey: 'idUser' })
      collectionShortVideos.belongsTo(models.shortVideos, { foreignKey: 'idShortVideo' })

    }
  }
  collectionShortVideos.init({
    idShortVideo: DataTypes.STRING,
    idUser: DataTypes.STRING,
    stt: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'collectionShortVideos',
  });
  return collectionShortVideos;
};