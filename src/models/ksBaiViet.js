'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ksBaiViet extends Model {
        static associate(models) {
            // define association here
            // User.hasMany(models.cart, { foreignKey: 'idUser' });

        }
    }
    ksBaiViet.init(
        {
            anhBia: DataTypes.TEXT,
            tieuDe: DataTypes.STRING,
            timeText: DataTypes.STRING,
            description: DataTypes.TEXT,
            contentHtml: DataTypes.TEXT,
            timeDouble: DataTypes.DOUBLE,

        },
        {
            sequelize,
            modelName: 'ksBaiViet',
        }
    );
    return ksBaiViet;
};
