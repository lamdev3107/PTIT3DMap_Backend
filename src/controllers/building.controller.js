import { StatusCodes } from "http-status-codes";
import db from "../models";
import { Op } from "sequelize";

const createNewBuilding = async (req, res, next) => {
  try {
    const model = req.file;
    let modelURL = null;
    let modelPublicId = null;
    if (model) {
      modelURL = model.path;
      modelPublicId = model.filename;
    }
    const { name, description } = req.body;
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Name is required",
        data: null,
      });
    }
    const newBuilding = await db.Building.create({
      name,
      description,
      modelURL,
      modelPublicId,
    });
    return res.status(200).json({
      success: true,
      message: "Building created successfully",
      data: newBuilding,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBuildings = async (req, res, next) => {
  try {
    const {
      orderby = "createdAt", // Giá trị mặc định là sắp xếp theo thời gian
      order = "desc", // Giá trị mặc định là giảm dần (mới nhất trước)
      page = 1,
      limit = 10,
      search = null,
    } = req.query;

    // Kiểm tra orderby hợp lệ
    const allowedFields = ["id", "name"];
    const allowedOrders = ["asc", "desc"];
    const orderField = allowedFields.includes(orderby) ? orderby : "createdAt";
    const orderDirection = allowedOrders.includes(order.toLowerCase())
      ? order.toLowerCase()
      : "desc";
    let whereClause = {};
    if (search) {
      whereClause.name = {
        [Op.like]: `%${search}%`,
      };
    }

    const offset = (page - 1) * limit;
    const { rows: buildings, count } = await db.Building.findAndCountAll({
      where: whereClause,
      order: [[orderField, orderDirection]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      // attributes: {
      //   exclude: ["model"],
      // },
    });

    return res.status(200).json({
      success: true,
      message: "Buildings fetched successfully",
      data: buildings,
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

const getBuilding = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "ID is required",
        data: null,
      });
    const building = await db.Building.findOne({
      where: { id },
      include: [
        {
          model: db.Floor,
          as: "floors",
          include: [
            {
              model: db.Room,
              as: "rooms",
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Building fetched successfully",
      data: building,
    });
  } catch (error) {
    next(error);
  }
};
const getBuildingFloors = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "ID is required",
        data: null,
      });
    const floors = await db.Floor.findAll({
      where: { buildingId: id },
    });

    return res.status(200).json({
      success: true,
      message: "get building's floors successfully",
      data: floors,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBuilding = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "ID is required",
        data: null,
      });
    const building = await db.Building.destroy({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Delete building successfully",
      data: building,
    });
  } catch (error) {
    next(error);
  }
};

const updateBuilding = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;
    const updatePayload = {};
    if (req.file) {
      updatePayload.modelURL = req.file.path;
      updatePayload.modelPublicId = req.file.filename;
    }

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields",
        data: null,
      });
    }

    const building = await db.Building.findByPk(id);
    if (!building) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Building not found",
        data: null,
      });
    }
    updatePayload.name = name;
    updatePayload.description = description;
    await building.update(updatePayload);
    const updatedBuilding = await db.Building.findByPk(id, { raw: true });
    return res.status(200).json({
      success: true,
      message: "Building created successfully",
      data: updatedBuilding,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllBuildings,
  createNewBuilding,
  getBuilding,
  deleteBuilding,
  updateBuilding,
  getBuildingFloors,
};
