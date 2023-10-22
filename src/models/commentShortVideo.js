'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commentShortVideos extends Model {

    static associate(models) {
      // define association here
      commentShortVideos.belongsTo(models.User, { foreignKey: 'idUser' })
      commentShortVideos.belongsTo(models.shortVideos, { foreignKey: 'idShortVideo' })
    }
  }
  commentShortVideos.init({

    idUser: DataTypes.STRING,
    idShortVideo: DataTypes.STRING,
    content: DataTypes.TEXT,
    stt: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'commentShortVideos',
  });
  return commentShortVideos;
};