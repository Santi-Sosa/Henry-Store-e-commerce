const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("checkout", {
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment: {
        type: DataTypes.ENUM("cash" , "card"),
        allowNull: false
    }
  });
}