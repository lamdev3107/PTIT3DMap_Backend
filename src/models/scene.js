"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Scene extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Scene.hasMany(models.Hotspot, {
        foreignKey: "scene",
      });
      Scene.belongsTo(models.Floor, {
        foreignKey: "floorId",
        as: "floor",
      });
    }
  }
  Scene.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      floorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      panorama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Scene",
      timestamps: true, // Thêm timestamps để Sequelize tự động cập nhật createdAt & updatedAt
    }
  );
  return Scene;
};
