'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class promotionProduct extends Model {

    static associate(models) {
      // define association here
      promotionProduct.belongsTo(models.product, { foreignKey: 'idProduct' })
    }
  }
  promotionProduct.init({

    idProduct: DataTypes.STRING,
    timePromotion: DataTypes.DOUBLE,
    numberPercent: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'promotionProduct',
  });
  return promotionProduct;
};