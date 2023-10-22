'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('imageProducts', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },







      idProduct: {
        allowNull: false,
        type: Sequelize.STRING
      },
      imagebase64: {
        type: Sequelize.TEXT
      },
      STTImage: {
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
    await queryInterface.dropTable('imageProducts');
  }
};