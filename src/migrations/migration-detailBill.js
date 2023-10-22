'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detailBills', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      idBill: {
        type: Sequelize.STRING
      },
      idProduct: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      isReviews: {
        type: Sequelize.STRING
      },
      idClassifyProduct: {
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
    await queryInterface.dropTable('detailBills');
  }
};