'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifycations extends Model {

    static associate(models) {
      // define association here
      notifycations.belongsTo(models.User, { foreignKey: 'idUser' })

    }
  }
  notifycations.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    timeCreate: DataTypes.DOUBLE,
    typeNotify: DataTypes.STRING,//order,system,promotion,short_video,blog
    idUser: DataTypes.STRING,
    urlImage: DataTypes.TEXT,
    redirect_to: DataTypes.STRING,
    seen: DataTypes.STRING





  }, {
    sequelize,
    modelName: 'notifycations',
  });
  return notifycations;
};