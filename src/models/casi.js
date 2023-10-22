'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class casi extends Model {
        static associate(models) {
            // define association here
            casi.hasMany(models.quanTamCaSi, { foreignKey: 'idCaSi' });
            casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    casi.init(
        {
            tenCaSi: DataTypes.STRING,
            moTa: DataTypes.TEXT,
            anh: DataTypes.STRING,
            idAnh: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'casi',
        }
    );
    return casi;
};
