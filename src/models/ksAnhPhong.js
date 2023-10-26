'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksAnhPhong extends Model {
        static associate(models) {
            // define association here
            ksAnhPhong.belongsTo(models.ksPhong, { foreignKey: 'idPhong' });
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
