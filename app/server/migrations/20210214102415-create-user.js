'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      // salt:{
      //   type: Sequelize.UUID,
      //   defaultValue: Sequelize.UUIDV4()
      // },
      // name: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      // },
      // userId: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   unique: true,
      // },
      // userIdType: {
      //   type: Sequelize.INTEGER,
      //   defaultValue:0
      // },
      // hashedPassword: {
      //   type: Sequelize.STRING,
      // },
      role: {
        type: Sequelize.INTEGER,
        defaultValue:100
      },
      block: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};