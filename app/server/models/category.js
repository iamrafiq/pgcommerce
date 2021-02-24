"use strict";
const { includes } = require("lodash");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.CategoryTranslation, {
        as: "translations",
        foreignKey: "categoryId",
      });
      Category.hasMany(models.Product, {
        as: "products",
        foreignKey: "categoryId",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, deletedAt:undefined };
    }
  }
  Category.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      parentUUID: {
        type: DataTypes.UUID,
      },
      productCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      icon: {
        type: DataTypes.STRING,
      },
      thumbnail: {
        type: DataTypes.STRING,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      deletedAt: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    },
    {
      sequelize,
      tableName: "categories",
      modelName: "Category",
    }
  );

  return Category;
};
