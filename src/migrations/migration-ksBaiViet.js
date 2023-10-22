'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ksBaiViets', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },








      anhBia: {
        type: Sequelize.TEXT
      },

      tieuDe: {
        type: Sequelize.STRING
      },

      timeText: {
        type: Sequelize.STRING
      },

      description: {
        type: Sequelize.TEXT
      },

      contentHtml: {
        type: Sequelize.TEXT
      },

      timeDouble: {
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
    await queryInterface.dropTable('ksBaiViets');
  }
};