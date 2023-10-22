'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class collectionBlogs extends Model {

    static associate(models) {
      // define association here
      collectionBlogs.belongsTo(models.User, { foreignKey: 'idUser' })
      collectionBlogs.belongsTo(models.blogs, { foreignKey: 'idBlog' })

    }
  }
  collectionBlogs.init({
    idBlog: DataTypes.STRING,
    idUser: DataTypes.STRING,
    stt: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'collectionBlogs',
  });
  return collectionBlogs;
};