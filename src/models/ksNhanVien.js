'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksNhanVien extends Model {
        static associate(models) {
            // define association here
            // ksNhanVien.hasMany(models.ksPhong, { foreignKey: 'idChiNhanh' });
            ksNhanVien.hasMany(models.ksLuongNhanVien, { foreignKey: 'idNhanVien' });
        }
    }
    ksNhanVien.init(
        {
            hoTen: DataTypes.STRING,
            sdt: DataTypes.STRING,
            email: DataTypes.STRING,
            ngaySinh: DataTypes.STRING,
            chucVu: DataTypes.STRING, //chuc vu
            queQuan: DataTypes.STRING,
            anh: DataTypes.TEXT,
            gioiTinh: DataTypes.STRING,
            ghiChu: DataTypes.STRING, //ghi chu ve mot so thong tin
            luongCoBan: DataTypes.BIGINT, // luong 1 ngay theo chuc vu
            caLamViec: DataTypes.STRING //sang, trua, toi


        },
        {
            sequelize,
            modelName: 'ksNhanVien',
        }
    );
    return ksNhanVien;
};
