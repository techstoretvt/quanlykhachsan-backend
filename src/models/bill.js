'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bill extends Model {

    static associate(models) {
      // define association here
      bill.belongsTo(models.User, { foreignKey: 'idUser' })
      bill.hasMany(models.statusBills, { foreignKey: 'idBill' })
      bill.belongsTo(models.addressUser, { foreignKey: 'idAddressUser' })
      bill.hasMany(models.detailBill, { foreignKey: 'idBill' })
    }
  }
  bill.init({

    idUser: DataTypes.STRING,
    timeBill: DataTypes.STRING,
    idStatusBill: DataTypes.FLOAT,
    //1 chờ xác nhận, 2 đã xác nhận(đang giao), 3 đã giao,  4 đã hủy, 5 giao không thành công



    idAddressUser: DataTypes.STRING,
    note: DataTypes.STRING,
    totals: DataTypes.DOUBLE,
    noteCancel: DataTypes.STRING,
    payment: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'bill',
  });
  return bill;
};