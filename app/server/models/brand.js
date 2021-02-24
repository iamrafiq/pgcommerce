"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Brand.hasMany(models.BrandTranslation, {
        as: "translations",
        foreignKey: "brandId",
      });
      Brand.hasMany(models.Product, {
        as: "products",
        foreignKey: "brandId",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, deletedAt:undefined };
    }
  }
  Brand.init(
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
      productCount: {
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
      tableName: "brands",
      modelName: "Brand",
    }
  );
  return Brand;
};
