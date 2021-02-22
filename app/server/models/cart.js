'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.hasMany(models.CartItem, {
        as: "cartitems",
        sourceKey: "id",
        foreignKey: "cartId",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, deletedAt:undefined };
    }
  
    
  };
  Cart.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    userUUID: {
      type: DataTypes.UUID,
    },
    active: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    expireOn: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    SKU: {
      type: DataTypes.STRING,
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  }, {
    sequelize,
    tableName: "carts",
    modelName: 'Cart',
  });
  return Cart;
};