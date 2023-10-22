'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shortVideos', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },


      idUser: {
        type: Sequelize.STRING
      },
      idDriveVideo: {
        type: Sequelize.STRING
      },
      urlImage: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      scope: {
        type: Sequelize.STRING
      },
      idCloudinary: {
        type: Sequelize.STRING
      },
      loadImage: {
        type: Sequelize.STRING
      },
      loadVideo: {
        type: Sequelize.STRING
      },

      countLike: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
      },

      countComment: {
        defaultValue: 0,
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('shortVideos');
  }
};