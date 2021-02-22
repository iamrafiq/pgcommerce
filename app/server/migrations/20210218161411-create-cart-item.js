'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cartitems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4()
      },
      productUUID:{
        type: Sequelize.UUID,
      },
      cartId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'carts',
            schema: 'public'
          },
          key: 'id'
        }
      },
      shipingUUID:{
        type: Sequelize.UUID,
      },
      active: { // is this product still available
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      expireOn: { // this product will unavilable if user dose not checkout cart associted this product within this date.
        type: Sequelize.DATE,
        defaultValue: null,
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
      applyDiscounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      productMeta: { // holde json formated data of name, pictures, subText... etc
        type: Sequelize.JSON,
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
    await queryInterface.dropTable('cartitems');
  }
};