'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('baihats', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },

            tenBaiHat: {
                type: Sequelize.STRING,
            },
            loiBaiHat: {
                type: Sequelize.TEXT,
            },
            anhBia: {
                type: Sequelize.STRING,
            },
            linkBaiHat: {
                type: Sequelize.STRING,
            },
            thoiGian: {
                type: Sequelize.DOUBLE,
            },
            luotNghe: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            linkMV: {
                type: Sequelize.TEXT,
            },


            tenNhacSi: {
                type: Sequelize.STRING,
            },
            theLoai: {
                type: Sequelize.STRING,
            },
            ngayPhatHanh: {
                type: Sequelize.STRING,
            },
            nhaCungCap: {
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
        await queryInterface.dropTable('baihats');
    },
};
