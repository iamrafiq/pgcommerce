'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CartItem.belongsTo(models.Cart, { as: "cart", foreignKey: 'cartId' })

    }
    toJSON() {
      return { ...this.get(), id: undefined, deletedAt:undefined, cartId: undefined };
    }
  };
  CartItem.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    productUUID: {
      type: DataTypes.UUID,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "carts",
          schema: "public",
        },
        key: "id",
      },
    },
    shipingUUID: {
      type: DataTypes.UUID,
    },
    active: { // is this product still available
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    expireOn: { // this product will unavilable if user dose not checkout cart associted this product within this date.
      type: DataTypes.DATE,
      defaultValue: null,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    unitPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    cropPrice: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    applyDiscounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    productMeta: {
      type: DataTypes.JSON,
    },
  }, {
    sequelize,
    tableName: "cartitems",
    modelName: 'CartItem',
  });
  return CartItem;
};