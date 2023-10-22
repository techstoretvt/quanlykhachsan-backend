'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carts', {
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
      amount: {
        type: Sequelize.INTEGER
      },
      idClassifyProduct: {
        type: Sequelize.STRING
      },
      stt: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      isChoose: {
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
    await queryInterface.dropTable('carts');
  }
};