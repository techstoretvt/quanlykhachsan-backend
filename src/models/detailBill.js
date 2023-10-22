'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detailBill extends Model {

    static associate(models) {
      // define association here
      detailBill.belongsTo(models.bill, { foreignKey: 'idBill' })
      detailBill.belongsTo(models.product, { foreignKey: 'idProduct' })
      detailBill.belongsTo(models.classifyProduct, { foreignKey: 'idClassifyProduct' })
      detailBill.hasMany(models.evaluateProduct, { foreignKey: 'idDetailBill' })
    }
  }
  detailBill.init({

    idBill: DataTypes.STRING,
    idProduct: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    isReviews: DataTypes.STRING, //md: false
    idClassifyProduct: DataTypes.STRING,


  }, {
    sequelize,
    modelName: 'detailBill',
  });
  return detailBill;
};