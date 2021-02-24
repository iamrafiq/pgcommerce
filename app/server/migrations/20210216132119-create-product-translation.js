'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('producttranslations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4(),
      },
      code: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      summary: {
        type: Sequelize.TEXT,
        defaultValue:null
      },
      description: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      featureDescription: {
        type: Sequelize.JSON,
        defaultValue:null
      },
      subText: {
        type: Sequelize.STRING,
        defaultValue:null
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "products",
            schema: "public",
          },
          key: "id",
        },
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('producttranslations');
  }
};