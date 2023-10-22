'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },

      nameProduct: {
        type: Sequelize.STRING
      },
      nameProductEn: {
        type: Sequelize.STRING
      },
      priceProduct: {
        type: Sequelize.STRING
      },
      idTypeProduct: {
        allowNull: false,
        type: Sequelize.STRING
      },
      idTrademark: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contentHTML: {
        type: Sequelize.TEXT
      },
      contentMarkdown: {
        type: Sequelize.TEXT
      },
      isSell: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sold: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      stt: {
        allowNull: false,
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
    await queryInterface.dropTable('products');
  }
};