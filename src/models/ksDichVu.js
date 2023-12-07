'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksDichVu extends Model {
        static associate(models) {
            // define association here
            // ksDichVu.hasMany(models.ksPhong, { foreignKey: 'idChiNhanh' });
            // ksDichVu.hasMany(models.ksNhanVien, { foreignKey: 'idChiNhanh' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksDichVu.init(
        {
            tenDichVu: DataTypes.STRING,
            kho: DataTypes.INTEGER,
            gia: DataTypes.INTEGER,

        },
        {
            sequelize,
            modelName: 'ksDichVu',
        }
    );
    return ksDichVu;
};
