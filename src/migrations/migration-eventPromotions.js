'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('eventPromotions', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      nameEvent: {
        type: Sequelize.STRING
      },
      timeStart: {
        type: Sequelize.DOUBLE
      },
      timeEnd: {
        type: Sequelize.DOUBLE
      },
      cover: {
        type: Sequelize.STRING
      },
      idCover: {
        type: Sequelize.STRING
      },
      firstContent: {
        type: Sequelize.TEXT
      },
      lastContent: {
        type: Sequelize.TEXT
      },
      stt: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },



      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('eventPromotions');
  }
};