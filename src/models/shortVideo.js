'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shortVideos extends Model {

    static associate(models) {
      // define association here
      shortVideos.hasMany(models.hashTagVideos, { foreignKey: 'idShortVideo' })
      shortVideos.belongsTo(models.User, { foreignKey: 'idUser' })
      shortVideos.hasMany(models.commentShortVideos, { foreignKey: 'idShortVideo' })
      shortVideos.hasMany(models.likeShortVideos, { foreignKey: 'idShortVideo' })
      shortVideos.hasMany(models.collectionShortVideos, { foreignKey: 'idShortVideo' })
      shortVideos.hasMany(models.reportVideos, { foreignKey: 'idShortVideo' })

    }
  }
  shortVideos.init({
    idUser: DataTypes.STRING,
    idDriveVideo: DataTypes.STRING,
    urlImage: DataTypes.STRING,
    content: DataTypes.STRING,
    scope: DataTypes.STRING, //public,private
    stt: DataTypes.INTEGER,
    idCloudinary: DataTypes.STRING,

    countLike: DataTypes.DOUBLE,
    countComment: DataTypes.DOUBLE,

    loadImage: DataTypes.STRING,
    loadVideo: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'shortVideos',
  });
  return shortVideos;
};