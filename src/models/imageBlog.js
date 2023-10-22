'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class imageBlogs extends Model {

    static associate(models) {
      // define association here
      imageBlogs.belongsTo(models.blogs, { foreignKey: 'idBlog' })

    }
  }
  imageBlogs.init({
    idBlog: DataTypes.STRING,
    image: DataTypes.TEXT,

    idCloudinary: DataTypes.STRING,
    stt: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'imageBlogs',
  });
  return imageBlogs;
};