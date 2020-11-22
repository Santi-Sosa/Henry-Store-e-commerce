const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("orderLine", {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
}