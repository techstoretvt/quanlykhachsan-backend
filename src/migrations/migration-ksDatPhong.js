'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ksDatPhongs', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            idPhong: {
                type: Sequelize.STRING
            },
            idKhach: {
                type: Sequelize.STRING
            },
            timeStart: {
                type: Sequelize.BIGINT
            },
            timeEnd: {
                type: Sequelize.BIGINT
            },
            khuyenMai: {
                type: Sequelize.INTEGER
            },
            thanhTien: {
                type: Sequelize.BIGINT
            },
            loaiThanhToan: {
                type: Sequelize.INTEGER
            },
            isThanhToan: {
                type: Sequelize.INTEGER
            },
            trangThai: {
                type: Sequelize.INTEGER
            },

            verifyCode: {
                type: Sequelize.STRING
            },
            ghiChu: {
                type: Sequelize.STRING
            },
            idUser: {
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
        await queryInterface.dropTable('ksDatPhongs');
    },
};
