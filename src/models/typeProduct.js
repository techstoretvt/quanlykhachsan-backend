'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class typeProduct extends Model {

    static associate(models) {
      // define association here
      typeProduct.hasMany(models.trademark, { foreignKey: 'idTypeProduct' })



      typeProduct.hasMany(models.product, { foreignKey: 'idTypeProduct' })
    }
  }
  typeProduct.init({
    nameTypeProduct: DataTypes.STRING,
    nameTypeProductEn: DataTypes.STRING,
    imageTypeProduct: DataTypes.STRING,
    stt: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'typeProduct',
  });
  return typeProduct;
};