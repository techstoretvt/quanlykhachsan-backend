'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class danhSachPhat extends Model {
        static associate(models) {
            // define association here
            danhSachPhat.belongsTo(models.User, { foreignKey: 'idUser' });
            danhSachPhat.hasMany(models.chiTietDanhSachPhat, {
                foreignKey: 'idDanhSachPhat',
            });
        }
    }
    danhSachPhat.init(
        {
            tenDanhSach: DataTypes.STRING,
            idUser: DataTypes.STRING,
            anhDanhSach: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'danhSachPhat',
        }
    );
    return danhSachPhat;
};
