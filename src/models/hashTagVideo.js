'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hashTagVideos extends Model {

    static associate(models) {
      // define association here
      hashTagVideos.belongsTo(models.shortVideos, { foreignKey: 'idShortVideo' })
      hashTagVideos.belongsTo(models.product, { foreignKey: 'idProduct' })
    }
  }
  hashTagVideos.init({
    idShortVideo: DataTypes.STRING,
    idProduct: DataTypes.STRING,
    stt: DataTypes.INTEGER


  }, {
    sequelize,
    modelName: 'hashTagVideos',
  });
  return hashTagVideos;
};