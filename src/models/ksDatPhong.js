'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksDatPhong extends Model {
        static associate(models) {
            // define association here
            ksDatPhong.belongsTo(models.ksKhachHang, { foreignKey: 'idKhach' });
            ksDatPhong.belongsTo(models.ksPhong, { foreignKey: 'idPhong' });
            // casi.hasMany(models.baiHat_caSi, { foreignKey: 'idCaSi' });
        }
    }
    ksDatPhong.init(
        {
            idPhong: DataTypes.STRING,
            idKhach: DataTypes.STRING,
            timeStart: DataTypes.BIGINT,
            timeEnd: DataTypes.BIGINT,
            khuyenMai: DataTypes.INTEGER,
            thanhTien: DataTypes.BIGINT,
            loaiThanhToan: DataTypes.INTEGER,//1 tien mat, 2 paypal, 3 orther bank
            isThanhToan: DataTypes.INTEGER, //0 chua, 1 roi
            trangThai: DataTypes.INTEGER, //1 dat truoc, 2 nhan phong, 3 ket thuc


        },
        {
            sequelize,
            modelName: 'ksDatPhong',
        }
    );
    return ksDatPhong;
};
