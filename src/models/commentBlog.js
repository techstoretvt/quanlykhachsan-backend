'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commentBlog extends Model {

    static associate(models) {
      // define association here
      commentBlog.belongsTo(models.User, { foreignKey: 'idUser' })
      commentBlog.belongsTo(models.blogs, { foreignKey: 'idBlog' })
    }
  }
  commentBlog.init({

    idUser: DataTypes.STRING,
    idBlog: DataTypes.STRING,
    timeCommentBlog: DataTypes.STRING,
    content: DataTypes.TEXT,
    stt: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'commentBlog',
  });
  return commentBlog;
};