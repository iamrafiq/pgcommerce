'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.ProductTranslation, {
        as: "translations",
        sourceKey: "id",
        foreignKey: "productId",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, deletedAt: undefined};
    }
  };
  Product.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    categoryUUID: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
    brandUUID: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
    clusterUUID: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Slug must be unique.",
      },
      validate: {
        notNull: { msg: "Slug must have a string value" },
        notEmpty: { msg: "Slug must not be empty" },
      },
    },
    photos: {
      type: DataTypes.JSON,
    },
    offerPhotos: {
      type: DataTypes.JSON,
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
    regularStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    expressStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    unitsInOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    blockSale: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    shippability: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    isAlwaysAvailable: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    blockAtWarehouse: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    applyDiscounts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    earliestAvailabilityTime: {
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
    tableName: "products",
    modelName: 'Product',
  });
  return Product;
};