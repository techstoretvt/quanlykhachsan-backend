'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifycations', {
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
      idUser: {
        type: Sequelize.STRING
      },
      timeCreate: {
        type: Sequelize.DOUBLE
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
      seen: {
        type: Sequelize.STRING,
        defaultValue: 'false'
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
    await queryInterface.dropTable('notifycations');
  }
};