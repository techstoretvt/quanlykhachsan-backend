'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ksDoanhThus', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            thang: {
                type: Sequelize.INTEGER
            },
            nam: {
                type: Sequelize.INTEGER
            },
            tien: {
                type: Sequelize.BIGINT
            },
            loaiTien: {
                type: Sequelize.INTEGER
            },
            ghiChu: {
                type: Sequelize.STRING
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
        await queryInterface.dropTable('ksDoanhThus');
    },
};
