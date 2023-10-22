'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class imageProduct extends Model {

    static associate(models) {
      // define association here
      imageProduct.belongsTo(models.product, { foreignKey: 'idProduct', as: 'imageProduct-product' })
    }
  }
  imageProduct.init({
    idProduct: DataTypes.STRING,
    imagebase64: DataTypes.TEXT,
    STTImage: DataTypes.INTEGER


  }, {
    sequelize,
    modelName: 'imageProduct',
  });
  return imageProduct;
};