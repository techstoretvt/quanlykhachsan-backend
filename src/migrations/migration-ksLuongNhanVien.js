'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ksLuongNhanViens', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            idNhanVien: {
                type: Sequelize.STRING
            },
            ngayCong: {
                type: Sequelize.INTEGER
            },
            ngayPhep: {
                type: Sequelize.INTEGER
            },
            tangCa: {
                type: Sequelize.INTEGER
            },
            thang: {
                type: Sequelize.INTEGER
            },
            nam: {
                type: Sequelize.INTEGER
            },
            ungLuong: {
                type: Sequelize.BIGINT
            },
            luongThuong: {
                type: Sequelize.BIGINT
            },
            thucLanh: {
                type: Sequelize.BIGINT
            },
            phuCap: {
                type: Sequelize.BIGINT
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
        await queryInterface.dropTable('ksLuongNhanViens');
    },
};
