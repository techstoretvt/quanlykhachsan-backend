'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ksNhanViens', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            hoTen: {
                type: Sequelize.STRING
            },
            sdt: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            ngaySinh: {
                type: Sequelize.STRING
            },
            chucVu: {
                type: Sequelize.STRING
            },
            queQuan: {
                type: Sequelize.STRING
            },
            anh: {
                type: Sequelize.TEXT
            },
            gioiTinh: {
                type: Sequelize.STRING
            },
            ghiChu: {
                type: Sequelize.STRING
            },
            luongCoBan: {
                type: Sequelize.BIGINT
            },
            caLamViec: {
                type: Sequelize.STRING
            },
            idChiNhanh: {
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
        await queryInterface.dropTable('ksNhanViens');
    },
};
