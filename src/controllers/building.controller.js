import { StatusCodes } from "http-status-codes";
import db from "../models";

const createNewBuilding = async (req, res, next) => {
  try {
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
    } = req.query;

    // Kiểm tra orderby hợp lệ
    const allowedFields = ["createdAt"];
    const allowedOrders = ["asc", "desc"];
    const orderField = allowedFields.includes(orderby) ? orderby : "createdAt";
    const orderDirection = allowedOrders.includes(order.toLowerCase())
      ? order.toLowerCase()
      : "desc";
    let whereClause = {};

    const offset = (page - 1) * limit;
    const { rows: buildings, count } = await db.Building.findAndCountAll({
      where: whereClause,
      order: [[orderField, orderDirection]],
      limit: parseInt(limit),
      offset: parseInt(offset),
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
      raw: true,
      nest: true,
      include: [{ model: db.Floor, as: "floors" }],
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
    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields",
        data: null,
      });
    }
    const building = await db.Building.findByPk(id, {
      raw: true,
    });
    if (!building) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Building not found",
        data: null,
      });
    }
    await db.Building.update({
      name,
      description,
    });
    const updatedBuilding = await db.Building.findByPk(id, {
      raw: true,
    });
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
};
