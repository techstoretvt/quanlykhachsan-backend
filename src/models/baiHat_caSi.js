'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class baiHat_caSi extends Model {
        static associate(models) {
            // define association here
            // baiHatVaCaSi.hasMany(models.baihat, { foreignKey: 'idbaiHatVaCaSi' });
            baiHat_caSi.belongsTo(models.baihat, { foreignKey: 'idBaiHat' });
            baiHat_caSi.belongsTo(models.casi, { foreignKey: 'idCaSi' });
        }
    }
    baiHat_caSi.init(
        {
            idCaSi: DataTypes.STRING,
            idBaiHat: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'baiHat_caSi',
        }
    );
    return baiHat_caSi;
};
