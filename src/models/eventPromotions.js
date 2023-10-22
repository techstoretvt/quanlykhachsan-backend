'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class eventPromotions extends Model {

    static associate(models) {
      // define association here
      eventPromotions.hasMany(models.productEvents, { foreignKey: 'idEventPromotion' })
    }
  }
  eventPromotions.init({
    nameEvent: DataTypes.STRING,
    timeStart: DataTypes.DOUBLE,
    timeEnd: DataTypes.DOUBLE,
    cover: DataTypes.STRING,
    idCover: DataTypes.STRING,
    firstContent: DataTypes.TEXT,
    lastContent: DataTypes.TEXT,


    stt: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'eventPromotions',
  });
  return eventPromotions;
};