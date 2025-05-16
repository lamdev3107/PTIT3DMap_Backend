"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Hotspot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Hotspot.belongsTo(models.Scene, {
        foreignKey: "scene",
      });
    }
  }
  Hotspot.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      scene: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sceneId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pitch: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      yaw: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Hotspot",
      timestamps: true, // Thêm timestamps để Sequelize tự động cập nhật createdAt & updatedAt
    }
  );
  return Hotspot;
};
