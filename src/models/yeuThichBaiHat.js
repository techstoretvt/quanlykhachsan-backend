'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class yeuThichBaiHat extends Model {
        static associate(models) {
            // define association here
            yeuThichBaiHat.belongsTo(models.User, { foreignKey: 'idUser' });
            yeuThichBaiHat.belongsTo(models.baihat, { foreignKey: 'idBaiHat' });
        }
    }
    yeuThichBaiHat.init(
        {
            idBaiHat: DataTypes.STRING,
            idUser: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'yeuThichBaiHat',
        }
    );
    return yeuThichBaiHat;
};
