'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
      };
    }
  };
  Auth.init({
    uuid: {
      type: DataTypes.STRING, // saving firebase uid
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: 100,  //role< 0 = super admin, role < 50 = admin,  role <99 = clerk/seller, role => 100 buyer
    },
    block: {
      type: DataTypes.INTEGER,
      defaultValue: 0, // 0 unblocked, 1 blocked
    },
    deletedAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  }, {
    sequelize,
    tableName: "auths",
    modelName: 'Auth',
  });
  return Auth;
};