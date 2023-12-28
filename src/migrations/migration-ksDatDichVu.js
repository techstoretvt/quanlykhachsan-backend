'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ksDatDichVus', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            idDichVu: {
                type: Sequelize.STRING,
            },
            thoiGian: {
                type: Sequelize.DOUBLE,
            },
            idPhong: {
                type: Sequelize.STRING,
            },
            soLuong: {
                type: Sequelize.INTEGER,
            },
            idDatPhong: {
                type: Sequelize.STRING,
            },


            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('ksDatDichVus');
    },
};
