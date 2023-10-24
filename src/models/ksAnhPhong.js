'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksAnhPhong extends Model {
        static associate(models) {
            // define association here
            // casi.hasMany(models.quanTamCaSi, { foreignKey: 'idCaSi' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksAnhPhong.init(
        {
            idPhong: DataTypes.STRING,
            urlAnh: DataTypes.TEXT,
            idAnh: DataTypes.STRING,

        },
        {
            sequelize,
            modelName: 'ksAnhPhong',
        }
    );
    return ksAnhPhong;
};
