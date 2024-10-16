'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksDatDichVu extends Model {
        static associate(models) {
            // define association here
            // ksDatDichVu.hasMany(models.ksPhong, { foreignKey: 'idChiNhanh' });
            // ksDatDichVu.hasMany(models.ksNhanVien, { foreignKey: 'idChiNhanh' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
            ksDatDichVu.belongsTo(models.ksDichVu, { foreignKey: 'idDichVu' });
        }
    }
    ksDatDichVu.init(
        {
            idDichVu: DataTypes.STRING,
            thoiGian: DataTypes.DOUBLE,
            idPhong: DataTypes.STRING,
            soLuong: DataTypes.INTEGER,
            idDatPhong: DataTypes.STRING,


        },
        {
            sequelize,
            modelName: 'ksDatDichVu',
        }
    );
    return ksDatDichVu;
};
