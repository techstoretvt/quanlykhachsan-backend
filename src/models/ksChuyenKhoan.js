'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksChuyenKhoan extends Model {
        static associate(models) {
            // define association here
            ksChuyenKhoan.belongsTo(models.ksDatPhong, { foreignKey: 'idDatPhong' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksChuyenKhoan.init(
        {
            idDatPhong: DataTypes.STRING,
            trangThai: DataTypes.INTEGER, //0 chua xem, 1 da xac minh, 2 ko hop le
            urlAnh: DataTypes.TEXT,
            ghiChu: DataTypes.TEXT,

        },
        {
            sequelize,
            modelName: 'ksChuyenKhoan',
        }
    );
    return ksChuyenKhoan;
};
