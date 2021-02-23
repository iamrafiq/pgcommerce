'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTranslation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON() {
      return { ...this.get(), id: undefined, deletedAt:undefined, productId: undefined};
    }
  };
  ProductTranslation.init({
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Name must have a value" },
        notEmpty: { msg: "Name must not be empty" },
      },
     
    },
    description: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notNull: { msg: "Description must have a value" },
        notEmpty: { msg: "Description must not be empty" },
      },
     
    },
    featureDescription: {
      type: DataTypes.JSON,
      defaultValue:null
    },
    subText: {
      type: DataTypes.STRING,
      defaultValue:null
    },
    productId: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.DATE,
      defaultValue: null,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    tableName: "producttranslations",
    modelName: 'ProductTranslation',
  });
  return ProductTranslation;
};