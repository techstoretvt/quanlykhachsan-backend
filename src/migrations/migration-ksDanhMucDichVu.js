'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ksDanhMucDichVus', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            tenDanhMuc: {
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
        await queryInterface.dropTable('ksDanhMucDichVus');
    },
};
