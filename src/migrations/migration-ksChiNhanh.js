'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ksChiNhanhs', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            idThanhPho: {
                type: Sequelize.STRING,
            },
            tenChiNhanh: {
                type: Sequelize.STRING,
            },
            diaChi: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('ksChiNhanhs');
    },
};
