'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class chiTietDanhSachPhat extends Model {
        static associate(models) {
            // define association here
            chiTietDanhSachPhat.belongsTo(models.danhSachPhat, {
                foreignKey: 'idDanhSachPhat',
            });

            chiTietDanhSachPhat.belongsTo(models.baihat, {
                foreignKey: 'idBaiHat',
            });
        }
    }
    chiTietDanhSachPhat.init(
        {
            idDanhSachPhat: DataTypes.STRING,
            idBaiHat: DataTypes.STRING,
            stt: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'chiTietDanhSachPhat',
        }
    );
    return chiTietDanhSachPhat;
};
