const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("images", {
    img: {
      type: DataTypes.BLOB,
      get() {
        return this.getDataValue("img").toString("utf8");
      },
    },
  });
};
