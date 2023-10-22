'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class baihat extends Model {
        static associate(models) {
            // define association here
            baihat.hasOne(models.chiTietDanhSachPhat, {
                foreignKey: 'idBaiHat',
            });
            baihat.hasMany(models.yeuThichBaiHat, { foreignKey: 'idBaiHat' });
            baihat.hasMany(models.baiHat_caSi, { foreignKey: 'idBaiHat' });
            baihat.hasMany(models.loiBaiHat, { foreignKey: 'idBaiHat' });
        }
    }
    baihat.init(
        {
            tenBaiHat: DataTypes.STRING,
            loiBaiHat: DataTypes.TEXT,
            anhBia: DataTypes.STRING,
            linkBaiHat: DataTypes.STRING,
            thoiGian: DataTypes.DOUBLE,
            luotNghe: DataTypes.INTEGER,
            linkMV: DataTypes.TEXT,
            tenNhacSi: DataTypes.STRING,
            theLoai: DataTypes.STRING,
            ngayPhatHanh: DataTypes.STRING,
            nhaCungCap: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'baihat',
        }
    );
    return baihat;
};
