'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('videoBlogs', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      idBlog: {
        type: Sequelize.STRING
      },
      video: {
        type: Sequelize.TEXT
      },
      idDrive: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('videoBlogs');
  }
};