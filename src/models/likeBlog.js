'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class likeBlog extends Model {

    static associate(models) {
      // define association here
      likeBlog.belongsTo(models.User, { foreignKey: 'idUser' })
      likeBlog.belongsTo(models.blogs, { foreignKey: 'idBlog' })
    }
  }
  likeBlog.init({

    idUser: DataTypes.STRING,
    idBlog: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'likeBlog',
  });
  return likeBlog;
};