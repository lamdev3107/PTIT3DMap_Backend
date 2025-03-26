"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Floor extends Model {
    static associate(models) {
      // define association here
      Floor.belongsTo(models.Building, {
        foreignKey: "buildingId",
        as: "building",
      });
      Floor.hasMany(models.Room, {
        foreignKey: "floorId",
        as: "rooms",
      });
    }
  }
  Floor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      buildingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Floor",
      timestamps: true, // Thêm timestamps để Sequelize tự động cập nhật createdAt & updatedAt
    }
  );
  return Floor;
};
