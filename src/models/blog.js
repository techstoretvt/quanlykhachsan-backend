'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class blogs extends Model {

    static associate(models) {
      // define association here
      blogs.belongsTo(models.User, { foreignKey: 'idUser' })
      blogs.hasMany(models.commentBlog, { foreignKey: 'idBlog' })
      blogs.hasMany(models.likeBlog, { foreignKey: 'idBlog' })
      blogs.hasMany(models.imageBlogs, { foreignKey: 'idBlog' })
      blogs.hasOne(models.videoBlogs, { foreignKey: 'idBlog' })
      blogs.hasOne(models.blogShares, { foreignKey: 'idBlog', as: 'blogs-blogShares-parent' })
      blogs.hasOne(models.blogShares, { foreignKey: 'idBlogShare', as: 'blogs-blogShares-child' })
      blogs.hasMany(models.blogShares, { foreignKey: 'idBlogShare', as: 'listBlogShare' })
      blogs.hasMany(models.collectionBlogs, { foreignKey: 'idBlog' })
      blogs.hasMany(models.reportBlogs, { foreignKey: 'idBlog' })
    }
  }
  blogs.init({
    title: DataTypes.STRING,
    contentHTML: DataTypes.TEXT,
    contentMarkdown: DataTypes.TEXT,
    idUser: DataTypes.STRING,
    timeBlog: DataTypes.STRING,
    viewBlog: DataTypes.INTEGER,
    typeBlog: DataTypes.STRING, //product,default,shareBlog
    textShare: DataTypes.STRING,
    stt: DataTypes.INTEGER,
    timePost: DataTypes.DOUBLE,
    backgroundColor: DataTypes.STRING,
    editImage: DataTypes.STRING,
    editVideo: DataTypes.STRING,
    amountLike: DataTypes.DOUBLE,
    amountShare: DataTypes.DOUBLE,
    amountComment: DataTypes.DOUBLE,

  }, {
    sequelize,
    modelName: 'blogs',
  });
  return blogs;
};