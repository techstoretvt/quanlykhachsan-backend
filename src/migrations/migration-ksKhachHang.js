'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ksKhachHangs', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            hoTen: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            sdt: {
                type: Sequelize.STRING
            },
            diem: {
                type: Sequelize.INTEGER
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
        await queryInterface.dropTable('ksKhachHangs');
    },
};
