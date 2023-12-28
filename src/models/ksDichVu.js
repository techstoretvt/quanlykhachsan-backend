'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksDichVu extends Model {
        static associate(models) {
            // define association here
            // ksDichVu.hasMany(models.ksPhong, { foreignKey: 'idChiNhanh' });
            // ksDichVu.hasMany(models.ksNhanVien, { foreignKey: 'idChiNhanh' });
            ksDichVu.hasMany(models.ksDatDichVu, { foreignKey: 'idDichVu' });
        }
    }
    ksDichVu.init(
        {
            tenDichVu: DataTypes.STRING,
            kho: DataTypes.INTEGER,
            gia: DataTypes.INTEGER,
            idDanhMuc: DataTypes.STRING,

        },
        {
            sequelize,
            modelName: 'ksDichVu',
        }
    );
    return ksDichVu;
};
