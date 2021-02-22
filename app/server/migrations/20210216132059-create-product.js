'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
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
      categoryUUID: {
        type: Sequelize.UUID,
        defaultValue: null,
      },
      brandUUID: {
        type: Sequelize.UUID,
        defaultValue: null,
      },
      clusterUUID: {
        type: Sequelize.UUID,
        defaultValue: null,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      photos: {
        type: Sequelize.JSON,
      },
      offerPhotos: {
        type: Sequelize.JSON,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      unitPrice: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      cropPrice: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      regularStock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      expressStock: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      unitsInOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      blockSale: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      shippability: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      isAlwaysAvailable: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      blockAtWarehouse: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      applyDiscounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      earliestAvailabilityTime: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
      SKU: {
        type: Sequelize.STRING,
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: null,
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
    await queryInterface.dropTable('products');
  }
};