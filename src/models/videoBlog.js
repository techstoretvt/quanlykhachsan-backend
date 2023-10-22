'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class videoBlogs extends Model {

    static associate(models) {
      // define association here
      videoBlogs.belongsTo(models.blogs, { foreignKey: 'idBlog' })
    }
  }
  videoBlogs.init({
    idBlog: DataTypes.STRING,
    video: DataTypes.TEXT,
    idDrive: DataTypes.STRING,
    stt: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'videoBlogs',
  });
  return videoBlogs;
};