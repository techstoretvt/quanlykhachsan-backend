'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class quanTamCaSi extends Model {
        static associate(models) {
            // define association here
            quanTamCaSi.belongsTo(models.User, { foreignKey: 'idUser' });
            quanTamCaSi.belongsTo(models.casi, { foreignKey: 'idCaSi' });
        }
    }
    quanTamCaSi.init(
        {
            idCaSi: DataTypes.STRING,
            idUser: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'quanTamCaSi',
        }
    );
    return quanTamCaSi;
};
