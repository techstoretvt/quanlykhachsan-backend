'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ksChuyenKhoans', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            idDatPhong: {
                type: Sequelize.STRING
            },
            trangThai: {
                type: Sequelize.INTEGER
            },
            urlAnh: {
                type: Sequelize.TEXT
            },
            ghiChu: {
                type: Sequelize.TEXT
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
        await queryInterface.dropTable('ksChuyenKhoans');
    },
};
