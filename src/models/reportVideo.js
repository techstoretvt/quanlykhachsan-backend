'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reportVideos extends Model {

    static associate(models) {

      reportVideos.belongsTo(models.shortVideos, { foreignKey: 'idShortVideo' })
      reportVideos.belongsTo(models.User, { foreignKey: 'idUser' })

    }
  }
  reportVideos.init({
    idShortVideo: DataTypes.STRING,
    content: DataTypes.STRING,
    idUser: DataTypes.STRING,
    status: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'reportVideos',
  });
  return reportVideos;
};