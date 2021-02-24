"use strict";
const crypto = require("crypto");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
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
  }
  User.init(
    {
      uuid: {
        type: DataTypes.STRING, // saving firebase uid
        allowNull: false,
      },
      // salt: {
      //   type: DataTypes.UUID,
      //   defaultValue: DataTypes.UUIDV4,
      // },
      // hashedPassword: {
      //   type: DataTypes.STRING(64),
      // },
      // password: {
      //   type: DataTypes.VIRTUAL,
      //   set: function (val) {
      //     this.setDataValue("password", val);
      //   },
      // },
      // oldPassword: {
      //   type: DataTypes.VIRTUAL,
      //   set: function (val) {
      //     this.setDataValue("oldPassword", val);
      //   },
      // },
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
    },
    {
      hooks: {
        // beforeCreate(user, options) {
        //   return cryptPassword(user.password, user.salt)
        //     .then((results) => {
        //       user.hashedPassword = results;
        //     })
        //     .catch((error) => {
        //       if (error) console.log(error);
        //     });
        // },
        // beforeBulkUpdate(user, options){
        //   if (user.attributes.oldPassword){
        //     const {password, salt}=user.attributes;
        //     return cryptPassword(password, salt)
        //     .then((results) => {
        //       user.attributes.hashedPassword = results;
        //     })
        //     .catch((error) => {
        //       if (error) console.log(error);
        //     });
        //   }
        // }
      },
      sequelize,
      tableName: "users",
      modelName: "User",
    }
  );
  function cryptPassword(password, salt) {
    return new Promise(function (resolve, reject) {
      try {
        const hash = crypto
          .createHmac("sha1", salt)
          .update(password)
          .digest("hex");
        console.log("hash :   ", hash);
        return resolve(hash);
      } catch (err) {
        return reject(err);
      }
    });
  }
  Model.prototype.authenticate = async function (plainText, salt, hashedPassword) {
    const h = await cryptPassword(plainText, salt) ;
    return h === hashedPassword;
  };
  // Model.prototype.newPassword = async function (plainText, salt) {
  //   return await cryptPassword(plainText, salt) ;
  // };
  return User;
};
