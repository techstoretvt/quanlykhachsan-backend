'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blogShares extends Model {

    static associate(models) {
      // define association here
      blogShares.belongsTo(models.blogs, { foreignKey: 'idBlog', as: 'blogs-blogShares-parent' })
      blogShares.belongsTo(models.blogs, { foreignKey: 'idBlogShare', as: 'blogs-blogShares-child' })
      blogShares.belongsTo(models.blogs, { foreignKey: 'idBlogShare', as: 'listBlogShare' })
      blogShares.belongsTo(models.product, { foreignKey: 'idProduct' })

    }
  }
  blogShares.init({
    idBlog: DataTypes.STRING,
    idProduct: DataTypes.STRING,
    idBlogShare: DataTypes.STRING,
    stt: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'blogShares',
  });
  return blogShares;
};