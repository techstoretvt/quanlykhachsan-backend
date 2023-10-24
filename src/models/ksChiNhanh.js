'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksChiNhanh extends Model {
        static associate(models) {
            // define association here
            // casi.hasMany(models.quanTamCaSi, { foreignKey: 'idCaSi' });
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
