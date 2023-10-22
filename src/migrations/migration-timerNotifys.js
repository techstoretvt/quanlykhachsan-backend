'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('timerNotifys', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },

      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },


      typeNotify: {
        type: Sequelize.STRING
      },
      urlImage: {
        type: Sequelize.TEXT
      },
      redirect_to: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      timer: {
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
    await queryInterface.dropTable('timerNotifys');
  }
};