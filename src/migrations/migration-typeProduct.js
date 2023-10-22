'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('typeProducts', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },



      nameTypeProduct: {
        type: Sequelize.STRING
      },
      nameTypeProductEn: {
        type: Sequelize.STRING
      },
      imageTypeProduct: {
        type: Sequelize.STRING
      },
      stt: {
        autoIncrement: true,
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
    await queryInterface.dropTable('typeProducts');
  }
};