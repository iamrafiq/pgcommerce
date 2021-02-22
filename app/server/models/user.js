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
        hashedPassword: undefined,
        salt: undefined,
        password: undefined,
      };
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      salt: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          notNull: { msg: "Name must have a string value" },
          notEmpty: { msg: "Name must not be empty" },
          len: {
            args: [4, 60],
            msg: "Please provide a value within 4 to 60 for name.",
          },
        },
      },
      userId: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: {
          args: true,
          msg: "Email address/Phone number already taken.",
        },
      },
      userIdType: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // 0 - email address, 1 - mobile phone
      },
      hashedPassword: {
        type: DataTypes.STRING(64),
      },
      password: {
        type: DataTypes.VIRTUAL,
        set: function (val) {
          this.setDataValue("password", val);
        },
      },
      oldPassword: {
        type: DataTypes.VIRTUAL,
        set: function (val) {
          this.setDataValue("oldPassword", val);
        },
      },
      role: {
        type: DataTypes.INTEGER,
        defaultValue: 100, // >99 for normal user
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
        beforeCreate(user, options) {
          return cryptPassword(user.password, user.salt)
            .then((results) => {
              user.hashedPassword = results;
            })
            .catch((error) => {
              if (error) console.log(error);
            });
        },
        beforeBulkUpdate(user, options){
          if (user.attributes.oldPassword){
            const {password, salt}=user.attributes;
            return cryptPassword(password, salt)
            .then((results) => {
              user.attributes.hashedPassword = results;
            })
            .catch((error) => {
              if (error) console.log(error);
            });
          }
        }
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
