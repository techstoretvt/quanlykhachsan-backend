'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksLuongNhanVien extends Model {
        static associate(models) {
            // define association here
            // ksLuongNhanVien.hasMany(models.ksPhong, { foreignKey: 'idChiNhanh' });
            ksLuongNhanVien.belongsTo(models.ksNhanVien, { foreignKey: 'idNhanVien' });
        }
    }
    ksLuongNhanVien.init(
        {
            idNhanVien: DataTypes.STRING,
            ngayCong: DataTypes.INTEGER, //so ngay lam
            ngayPhep: DataTypes.INTEGER, //so ngay nghi
            tangCa: DataTypes.INTEGER, //so ngay tang ca
            thang: DataTypes.INTEGER,
            nam: DataTypes.INTEGER,
            luongThuong: DataTypes.BIGINT, //luong ngay thuong
            ungLuong: DataTypes.BIGINT, //ung luong
            thucLanh: DataTypes.BIGINT, //tong luong
            phuCap: DataTypes.BIGINT, //tien cong them



        },
        {
            sequelize,
            modelName: 'ksLuongNhanVien',
        }
    );
    return ksLuongNhanVien;
};
