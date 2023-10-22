'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('statusBills', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      idBill: {
        type: Sequelize.STRING
      },
      nameStatus: {
        type: Sequelize.STRING
      },
      idStatusBill: {
        type: Sequelize.FLOAT
      },
      stt: {
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      timeStatus: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('statusBills');
  }
};