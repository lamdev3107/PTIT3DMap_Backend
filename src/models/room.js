"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Room.belongsTo(models.Floor, {
        foreignKey: "floorId",
        as: "floor",
      });
      Room.belongsTo(models.Navigation, {
        foreignKey: "navigationId",
        as: "navigation",
      });
    }
  }
  Room.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      floorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      navigationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Room",
      timestamps: true, // Thêm timestamps để Sequelize tự động cập nhật createdAt & updatedAt
    }
  );
  return Room;
};
