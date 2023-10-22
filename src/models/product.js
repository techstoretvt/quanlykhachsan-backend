'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {

    static associate(models) {
      // define association here
      product.belongsTo(models.typeProduct, { foreignKey: 'idTypeProduct' })
      product.belongsTo(models.trademark, { foreignKey: 'idTrademark' })
      product.hasMany(models.imageProduct, { foreignKey: 'idProduct', as: 'imageProduct-product' })
      product.hasMany(models.classifyProduct, { foreignKey: 'idProduct', as: 'classifyProduct-product' })
      product.hasMany(models.cart, { foreignKey: 'idProduct' })
      product.hasMany(models.detailBill, { foreignKey: 'idProduct' })
      product.hasMany(models.evaluateProduct, { foreignKey: 'idProduct' })
      product.hasMany(models.promotionProduct, { foreignKey: 'idProduct' })
      product.hasOne(models.blogShares, { foreignKey: 'idProduct' })
      product.hasMany(models.hashTagVideos, { foreignKey: 'idProduct' })
      product.hasMany(models.productEvents, { foreignKey: 'idProduct' })
    }
  }
  product.init({
    nameProduct: DataTypes.STRING,
    nameProductEn: DataTypes.STRING,
    priceProduct: DataTypes.STRING,
    idTypeProduct: DataTypes.STRING,
    idTrademark: DataTypes.STRING,
    contentHTML: DataTypes.TEXT,
    contentMarkdown: DataTypes.TEXT,
    isSell: DataTypes.STRING,
    sold: DataTypes.INTEGER,
    stt: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};