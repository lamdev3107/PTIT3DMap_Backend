"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Navigation extends Model {
    static associate(models) {
      Navigation.hasMany(models.Room, {
        foreignKey: "navigationId",
        as: "rooms",
      });
    }
  }
  Navigation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Navigation",
      timestamps: true, // Thêm timestamps để Sequelize tự động cập nhật createdAt & updatedAt
    }
  );
  return Navigation;
};
