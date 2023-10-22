'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class loiBaiHat extends Model {
        static associate(models) {
            // define association here
            // casi.hasMany(models.quanTamCaSi, { foreignKey: 'idCaSi' });
            loiBaiHat.belongsTo(models.baihat, { foreignKey: 'idBaiHat' });
        }
    }
    loiBaiHat.init(
        {
            idBaiHat: DataTypes.STRING,
            loiBaiHat: DataTypes.TEXT,
            thoiGian: DataTypes.DOUBLE,
        },
        {
            sequelize,
            modelName: 'loiBaiHat',
        }
    );
    return loiBaiHat;
};
