'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classifyProducts', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      idProduct: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
      nameClassifyProduct: {
        type: Sequelize.STRING
      },
      STTImg: {
        type: Sequelize.INTEGER
      },
      priceClassify: {
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
    await queryInterface.dropTable('classifyProducts');
  }
};