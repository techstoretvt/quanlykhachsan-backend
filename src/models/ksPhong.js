'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksPhong extends Model {
        static associate(models) {
            // define association here
            ksPhong.hasMany(models.ksDatPhong, { foreignKey: 'idPhong' });
            ksPhong.hasMany(models.ksAnhPhong, { foreignKey: 'idPhong' });
            ksPhong.belongsTo(models.ksChiNhanh, { foreignKey: 'idChiNhanh' })
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksPhong.init(
        {
            idChiNhanh: DataTypes.STRING,
            tenPhong: DataTypes.STRING,
            tienIch: DataTypes.TEXT,
            moTa: DataTypes.TEXT,
            soNguoi: DataTypes.INTEGER,
            soGiuongDoi: DataTypes.INTEGER,
            soPhongTam: DataTypes.INTEGER,
            donGia: DataTypes.INTEGER,
            dienTich: DataTypes.INTEGER,
            khuyenMai: DataTypes.INTEGER,
            trangThai: DataTypes.INTEGER, //1 hoat dong, 2 tam dung
            idDanhMucPhong: DataTypes.STRING


        },
        {
            sequelize,
            modelName: 'ksPhong',
        }
    );
    return ksPhong;
};
