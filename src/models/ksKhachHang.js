'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksKhachHang extends Model {
        static associate(models) {
            // define association here
            ksKhachHang.hasOne(models.ksDatPhong, { foreignKey: 'idPhong' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksKhachHang.init(
        {
            hoTen: DataTypes.STRING,
            email: DataTypes.STRING,
            sdt: DataTypes.STRING,
            diem: DataTypes.INTEGER

        },
        {
            sequelize,
            modelName: 'ksKhachHang',
        }
    );
    return ksKhachHang;
};
