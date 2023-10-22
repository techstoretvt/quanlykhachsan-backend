'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class timerNotifys extends Model {

    static associate(models) {
      // define association here
      // notifycations.belongsTo(models.User, { foreignKey: 'idUser' })

    }
  }
  timerNotifys.init({
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    typeNotify: DataTypes.STRING,//system,promotion,short_video,blog
    urlImage: DataTypes.TEXT,
    redirect_to: DataTypes.STRING,
    status: DataTypes.STRING,
    timer: DataTypes.DOUBLE




  }, {
    sequelize,
    modelName: 'timerNotifys',
  });
  return timerNotifys;
};