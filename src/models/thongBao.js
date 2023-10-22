'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class thongBao extends Model {
        static associate(models) {
            // define association here
        }
    }
    thongBao.init(
        {
            title: DataTypes.TEXT,
            content: DataTypes.TEXT,
            timeCreate: DataTypes.DOUBLE,
            urlImage: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: 'thongBao',
        }
    );
    return thongBao;
};
