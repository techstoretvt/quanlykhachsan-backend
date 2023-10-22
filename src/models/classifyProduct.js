'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class classifyProduct extends Model {

    static associate(models) {
      // define association here
      classifyProduct.belongsTo(models.product, { foreignKey: 'idProduct', as: 'classifyProduct-product' })
      classifyProduct.hasMany(models.cart, { foreignKey: 'idClassifyProduct' })
      classifyProduct.hasMany(models.detailBill, { foreignKey: 'idClassifyProduct' })
    }
  }
  classifyProduct.init({
    idProduct: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    nameClassifyProduct: DataTypes.STRING,
    STTImg: DataTypes.INTEGER,
    priceClassify: DataTypes.INTEGER


  }, {
    sequelize,
    modelName: 'classifyProduct',
  });
  return classifyProduct;
};