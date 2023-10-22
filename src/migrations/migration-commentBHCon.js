'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('commentBHCons', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING,
            },


            idCommentCha: {
                type: Sequelize.STRING,
            },
            idUser: {
                type: Sequelize.STRING,
            },
            noiDung: {
                type: Sequelize.TEXT,
            },
            thoiGian: {
                type: Sequelize.DOUBLE,
            },
            countLike: {
                type: Sequelize.DOUBLE,
            },
            nameUserReply: {
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
        await queryInterface.dropTable('commentBHCons');
    },
};
