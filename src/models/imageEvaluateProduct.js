'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class imageEvaluateProduct extends Model {

    static associate(models) {
      // define association here
      imageEvaluateProduct.belongsTo(models.evaluateProduct, { foreignKey: 'idEvaluateProduct' })
    }
  }
  imageEvaluateProduct.init({

    idEvaluateProduct: DataTypes.STRING,
    imagebase64: DataTypes.TEXT,
    idCloudinary: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'imageEvaluateProduct',
  });
  return imageEvaluateProduct;
};