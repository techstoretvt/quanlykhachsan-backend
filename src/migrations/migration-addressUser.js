'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addressUsers', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },

      idUser: {
        type: Sequelize.STRING
      },
      nameAddress: {
        type: Sequelize.STRING
      },
      isDefault: {
        type: Sequelize.STRING
      },
      fullname: {
        type: Sequelize.STRING
      },
      sdt: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      district: {
        type: Sequelize.STRING
      },
      addressText: {
        type: Sequelize.TEXT
      },
      status: {
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
    await queryInterface.dropTable('addressUsers');
  }
};