'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksThanhPho extends Model {
        static associate(models) {
            // define association here
            // casi.hasMany(models.quanTamCaSi, { foreignKey: 'idCaSi' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksThanhPho.init(
        {
            tenThanhPho: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'ksThanhPho',
        }
    );
    return ksThanhPho;
};
