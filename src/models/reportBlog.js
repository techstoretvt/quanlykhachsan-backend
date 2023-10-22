'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reportBlogs extends Model {

    static associate(models) {

      reportBlogs.belongsTo(models.blogs, { foreignKey: 'idBlog' })
      reportBlogs.belongsTo(models.User, { foreignKey: 'idUser' })

    }
  }
  reportBlogs.init({
    idBlog: DataTypes.STRING,
    content: DataTypes.STRING,
    idUser: DataTypes.STRING,
    status: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'reportBlogs',
  });
  return reportBlogs;
};