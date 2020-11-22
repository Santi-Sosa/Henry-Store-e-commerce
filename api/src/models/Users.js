const { DataTypes } = require("sequelize");
const crypto = require('crypto');
// var bcrypt = require('bcrypt');

module.exports = (sequelize) => {
sequelize.define("users", {
    name: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin','client'],
      defaultValue: 'client',
      allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
        set(value) {
          const rSalt = this.randomSalt();
          this.setDataValue('salt',rSalt);
          this.setDataValue(
            'password',
            crypto
              .createHmac('sha1', this.salt)
              .update(value)
              .digest('hex'),
          );
         },
      },   
      salt: {
        type: DataTypes.STRING,
      },
    },{
      paranoid: true,
    });
}