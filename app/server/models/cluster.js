'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cluster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cluster.hasMany(models.ClusterTranslation, {
        as: "translations",
        foreignKey: "clusterId",
      });
    }
    toJSON() {
      return { ...this.get(), id: undefined, deletedAt:undefined  };
    }
  };
  Cluster.init({
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
    productCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
  }, {
    sequelize,
    tableName: "clusters",
    modelName: 'Cluster',
  });
  return Cluster;
};