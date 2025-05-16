import { StatusCodes } from "http-status-codes";
import db from "../models";
import { Op } from "sequelize";

const createNewRoom = async (req, res, next) => {
  try {
    const { floorId, roomId, navigationId, name, description, image } =
      req.body;
    const model = req.file;
    let modelURL = null;
    let modelPublicId = null;
    if (model) {
      modelURL = model.path;
      modelPublicId = model.filename;
    }
    if (!name || !floorId || !roomId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields",
        data: null,
      });
    }
    const newRoom = await db.Room.create({
      floorId,
      roomId,
      modelURL,
      modelPublicId,
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
        {
          model: db.Scene,
          as: "scenes",
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
    const { floorId, roomId, navigationId, name, description, image } =
      req.body;
    let modelURL = null;
    let modelPublicId = null;
    if (req.file) {
      modelURL = req.file.path;
      modelPublicId = req.file.filename;
    }
    if (!name || !floorId || !roomId) {
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
      roomId,
      navigationId,
      name,
      modelURL,
      modelPublicId,
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
    const allowedFields = ["createdAt", "name", "floor", "building"];
    const allowedOrders = ["asc", "desc"];
    const orderField = allowedFields.includes(orderby) ? orderby : "createdAt";
    const orderDirection = allowedOrders.includes(order.toLowerCase())
      ? order.toLowerCase()
      : "desc";
    let orderArray = [];
    if (orderField === "floor") {
      orderArray = [
        [{ model: db.Floor, as: "floor" }, "name", orderDirection],
        ,
      ];
    } else if (orderField === "building") {
      orderArray = [
        [
          { model: db.Floor, as: "floor" },
          { model: db.Building, as: "building" },
          "name",
          orderDirection,
        ],
      ];
    } else if (orderField === "name") {
      orderArray = ["name", orderDirection];
    } else {
      orderArray = ["createdAt", orderDirection];
    }

    let whereClause = {};

    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`,
      };
    }

    const offset = (page - 1) * limit;

    const { rows: rooms, count } = await db.Room.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Floor,
          as: "floor",
          include: [
            {
              model: db.Building,
              as: "building",
            },
          ],
        },
      ],
      order: [orderArray], // Sửa cách sắp xếp theo floor.name
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

const getRoomScenes = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "room id is required",
        data: null,
      });
    }
    const room = await db.Room.findByPk(id, {
      include: [{ model: db.Scene, as: "scenes" }],
    });

    if (!room) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Room not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room scenes fetched successfully",
      data: room.scenes, // Changed from room.Scene to room.scenes
    });
  } catch (error) {
    next(error);
  }
};
export {
  createNewRoom,
  getRoom,
  deleteRoom,
  updateRoom,
  getAllRooms,
  getRoomScenes,
};
