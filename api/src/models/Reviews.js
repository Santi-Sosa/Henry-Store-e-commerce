const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("reviews", {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
}