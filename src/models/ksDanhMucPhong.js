'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksDanhMucPhong extends Model {
        static associate(models) {
            // define association here
            // ksDanhMucPhong.hasMany(models.ksPhong, { foreignKey: 'idChiNhanh' });
            // ksDanhMucPhong.hasMany(models.ksNhanVien, { foreignKey: 'idChiNhanh' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksDanhMucPhong.init(
        {
            tenDanhMuc: DataTypes.STRING,

        },
        {
            sequelize,
            modelName: 'ksDanhMucPhong',
        }
    );
    return ksDanhMucPhong;
};
