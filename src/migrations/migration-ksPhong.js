'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ksPhongs', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            idChiNhanh: {
                type: Sequelize.STRING
            },
            tenPhong: {
                type: Sequelize.STRING
            },
            tienIch: {
                type: Sequelize.TEXT
            },
            moTa: {
                type: Sequelize.TEXT
            },
            soNguoi: {
                type: Sequelize.INTEGER
            },
            soGiuongDoi: {
                type: Sequelize.INTEGER
            },
            soPhongTam: {
                type: Sequelize.INTEGER
            },
            donGia: {
                type: Sequelize.INTEGER
            },
            dienTich: {
                type: Sequelize.INTEGER
            },
            khuyenMai: {
                type: Sequelize.INTEGER
            },
            trangThai: {
                type: Sequelize.INTEGER
            },
            idDanhMucPhong: {
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
        await queryInterface.dropTable('ksPhongs');
    },
};
