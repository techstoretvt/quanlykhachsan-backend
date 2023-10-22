'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('evaluateProducts', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      idUser: {
        type: Sequelize.STRING
      },
      idProduct: {
        type: Sequelize.STRING
      },
      starNumber: {
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.TEXT
      },
      stt: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      displayname: {
        type: Sequelize.STRING
      },
      idDetailBill: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('evaluateProducts');
  }
};