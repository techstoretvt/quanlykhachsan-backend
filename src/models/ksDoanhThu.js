'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksDoanhThu extends Model {
        static associate(models) {
            // define association here
            // casi.hasMany(models.quanTamCaSi, { foreignKey: 'idCaSi' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksDoanhThu.init(
        {
            thang: DataTypes.INTEGER,
            nam: DataTypes.INTEGER,
            tien: DataTypes.BIGINT,
            loaiTien: DataTypes.INTEGER, //1 lai, 2 lo
            ghiChu: DataTypes.STRING

        },
        {
            sequelize,
            modelName: 'ksDoanhThu',
        }
    );
    return ksDoanhThu;
};
