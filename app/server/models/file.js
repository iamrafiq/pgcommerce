"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  File.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Url must have a string value" },
          notEmpty: { msg: "Url must not be empty" },
        },
      },
      genre: {
        type: DataTypes.STRING,
      },
      componentUUID: {
        type: DataTypes.UUIDV4,
      },
      componentSlug: {
        type: DataTypes.STRING,
      },
      componentField: {
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: "files",
      modelName: "File",
    }
  );
  return File;
};
