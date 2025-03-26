import { StatusCodes } from "http-status-codes";
import db from "../models";

const createNewRoom = async (req, res, next) => {
  try {
    const { floorId, navigationId, name, description, image } = req.body;
    if (!name || !floorId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields",
        data: null,
      });
    }
    const newRoom = await db.Room.create({
      floorId,
      navigationId,
      name,
      description,
      image,
    });
    return res.status(200).json({
      success: true,
      message: "Room created successfully",
      data: newRoom,
    });
  } catch (error) {
    next(error);
  }
};

const getRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "ID is required",
        data: null,
      });
    const room = await db.Room.findOne({
      where: { id },
      raw: true,
      nest: true,
      include: [
        {
          model: db.Floor,
          include: [{ model: db.Building, as: "building" }],
          as: "floor",
        },
        {
          model: db.Navigation,
          as: "navigation",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Room fetched successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "ID is required",
        data: null,
      });
    }
    const room = await db.Room.destroy({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Delete room successfully",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { floorId, navigationId, name, description, image } = req.body;
    if (!name || !floorId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields",
        data: null,
      });
    }
    const building = await db.Room.findByPk(id);
    if (!building) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Room not found",
        data: null,
      });
    }
    await building.update({
      floorId,
      navigationId,
      name,
      description,
      image,
    });
    const updatedRoom = await db.Room.findByPk(id, { raw: true });
    return res.status(200).json({
      success: true,
      message: "Room created successfully",
      data: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};
const getAllRooms = async (req, res, next) => {
  try {
    const {
      orderby = "createdAt", // Giá trị mặc định là sắp xếp theo thời gian
      order = "desc", // Giá trị mặc định là giảm dần (mới nhất trước)
      name,
      page = 1,
      limit = 10,
    } = req.query;

    // Kiểm tra orderby hợp lệ
    const allowedFields = ["createdAt"];
    const allowedOrders = ["asc", "desc"];
    const orderField = allowedFields.includes(orderby) ? orderby : "createdAt";
    const orderDirection = allowedOrders.includes(order.toLowerCase())
      ? order.toLowerCase()
      : "desc";
    let whereClause = {};
    if (name) {
      whereClause = {
        [Op.and]: [
          Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("name")), {
            [Op.like]: `%${name.toLowerCase()}%`,
          }),
        ],
      };
    }

    const offset = (page - 1) * limit;

    const { rows: rooms, count } = await db.Room.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Floor,
          as: "floor",
          include: [{ model: db.Building, as: "building" }],
        },
      ],
      order: [[orderField, orderDirection]],

      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      data: rooms,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalRecords: count,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { createNewRoom, getRoom, deleteRoom, updateRoom, getAllRooms };
