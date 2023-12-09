'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksDanhMucDichVu extends Model {
        static associate(models) {
            // define association here
            // ksDanhMucDichVu.hasMany(models.ksPhong, { foreignKey: 'idChiNhanh' });
            // ksDanhMucDichVu.hasMany(models.ksNhanVien, { foreignKey: 'idChiNhanh' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksDanhMucDichVu.init(
        {
            tenDanhMuc: DataTypes.STRING,

        },
        {
            sequelize,
            modelName: 'ksDanhMucDichVu',
        }
    );
    return ksDanhMucDichVu;
};
