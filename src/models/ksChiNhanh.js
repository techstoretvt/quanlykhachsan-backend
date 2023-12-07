'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksChiNhanh extends Model {
        static associate(models) {
            // define association here
            ksChiNhanh.hasMany(models.ksPhong, { foreignKey: 'idChiNhanh' });
            ksChiNhanh.hasMany(models.ksNhanVien, { foreignKey: 'idChiNhanh' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksChiNhanh.init(
        {
            idThanhPho: DataTypes.STRING,
            tenChiNhanh: DataTypes.STRING,
            diaChi: DataTypes.TEXT,

        },
        {
            sequelize,
            modelName: 'ksChiNhanh',
        }
    );
    return ksChiNhanh;
};
