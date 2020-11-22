const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {  
sequelize.define("order", {
    state: {
      type: DataTypes.ENUM,
      values: ["inCart", "created","active", "processing", "canceled", "complete"],
    },
  });
}