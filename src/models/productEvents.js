'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productEvents extends Model {

    static associate(models) {
      // define association here
      productEvents.belongsTo(models.eventPromotions, { foreignKey: 'idEventPromotion' })
      productEvents.belongsTo(models.product, { foreignKey: 'idProduct' })

    }
  }
  productEvents.init({
    idEventPromotion: DataTypes.STRING,
    idProduct: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'productEvents',
  });
  return productEvents;
};