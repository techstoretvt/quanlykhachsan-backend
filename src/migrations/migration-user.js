'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },








      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      keyVerify: {
        type: Sequelize.STRING
      },
      pass: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.TEXT
      },
      avatarGoogle: {
        type: Sequelize.TEXT
      },
      avatarFacebook: {
        type: Sequelize.TEXT
      },
      idGoogle: {
        type: Sequelize.STRING
      },
      avatarGithub: {
        type: Sequelize.TEXT
      },
      typeAccount: {
        type: Sequelize.STRING
      },
      idFacebook: {
        type: Sequelize.STRING
      },
      idGithub: {
        type: Sequelize.STRING
      },
      idTypeUser: {
        allowNull: false,
        type: Sequelize.STRING
      },
      statusUser: {
        allowNull: false,
        type: Sequelize.STRING
      },


      sdt: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      birtday: {
        type: Sequelize.STRING
      },
      avatarUpdate: {
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
    await queryInterface.dropTable('Users');
  }
};