'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BrandTranslation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BrandTranslation.belongsTo(models.Brand, { as: "brand", foreignKey: 'brandId' })

    }
    toJSON() {
      return { ...this.get(), id: undefined, deletedAt:undefined, brandId: undefined };
    }
  };
  BrandTranslation.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        notNull: { msg: "Code must have a string value" },
        notEmpty: { msg: "Code must not be empty" },
        len: {
          args: [2, 6],
          msg: "Please provide a value within 2 to 6 for code.",
        },
      },
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notNull: { msg: "Name must have a string value" },
        notEmpty: { msg: "Name must not be empty" },
        len: {
          args: [2, 45],
          msg: "Please provide a value within 2 to 45 for name.",
        },
      },
     
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: "brands",
          schema: "public",
        },
        key: "id",
      },
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    tableName: "brandtranslations",
    modelName: 'BrandTranslation',
  });
  return BrandTranslation;
};