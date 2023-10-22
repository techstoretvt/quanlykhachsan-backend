'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trademark extends Model {

    static associate(models) {
      // define association here
      trademark.belongsTo(models.typeProduct, { foreignKey: 'idTypeProduct' })





      trademark.hasMany(models.product, { foreignKey: 'idTrademark' })
    }
  }
  trademark.init({
    nameTrademark: DataTypes.STRING,
    nameTrademarkEn: DataTypes.STRING,
    idTypeProduct: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'trademark',
  });
  return trademark;
};