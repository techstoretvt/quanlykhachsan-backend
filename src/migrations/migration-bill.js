'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bills', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      idUser: {
        type: Sequelize.STRING
      },
      timeBill: {
        type: Sequelize.STRING
      },
      idStatusBill: {
        type: Sequelize.FLOAT
      },
      idAddressUser: {
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.STRING
      },
      totals: {
        type: Sequelize.DOUBLE
      },
      noteCancel: {
        type: Sequelize.STRING
      },
      payment: {
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
    await queryInterface.dropTable('bills');
  }
};