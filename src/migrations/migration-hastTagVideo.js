'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hashTagVideos', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      idShortVideo: {
        type: Sequelize.STRING
      },
      idProduct: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('hashTagVideos');
  }
};