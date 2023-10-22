'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class statusBills extends Model {

    static associate(models) {
      // define association here
      // bill.belongsTo(models.User, { foreignKey: 'idUser' })
      // bill.belongsTo(models.statusBill, { foreignKey: 'idStatusBill' })
      // bill.belongsTo(models.addressUser, { foreignKey: 'idAddressUser' })
      // bill.hasMany(models.detailBill, { foreignKey: 'idBill' })
      statusBills.belongsTo(models.bill, { foreignKey: 'idBill' })
    }
  }
  statusBills.init({

    idBill: DataTypes.STRING,
    nameStatus: DataTypes.STRING,
    idStatusBill: DataTypes.FLOAT,
    //1 chờ xác nhận, 2 đã xác nhận(đang giao), 3 đã giao,  4 đã hủy, 5 giao không thành công
    stt: DataTypes.INTEGER,
    timeStatus: DataTypes.DOUBLE





  }, {
    sequelize,
    modelName: 'statusBills',
  });
  return statusBills;
};