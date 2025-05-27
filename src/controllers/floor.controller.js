import { StatusCodes } from "http-status-codes";
import db from "../models";

const createNewFloor = async (req, res, next) => {
  try {
    const { buildingId, name, description, image } = req.body;
    if (!name || !buildingId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields",
        data: null,
      });
    }
    const newFloor = await db.Floor.create({
      buildingId,
      name,
      description,
      image,
    });
    return res.status(200).json({
      success: true,
      message: "Floor created successfully",
      data: newFloor,
    });
  } catch (error) {
    next(error);
  }
};

const getFloor = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "ID is required",
        data: null,
      });
    const floor = await db.Floor.findOne({
      where: { id },
      include: [
        { model: db.Building, as: "building", attributes: ["id", "name"] },
        { model: db.Room, as: "rooms" },
        {
          model: db.Scene,
          as: "scenes",
        },
      ],
      // include: [{ model: db.Room, as: "rooms" }],
    });

    return res.status(200).json({
      success: true,
      message: "Floor fetched successfully",
      data: floor,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFloor = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "ID is required",
        data: null,
      });
    const building = await db.Floor.destroy({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Delete building successfully",
      data: building,
    });
  } catch (error) {
    next(error);
  }
};

const updateFloor = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { buildingId, name, description, image } = req.body;

    if (!name || !buildingId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing required fields",
        data: null,
      });
    }
    const building = await db.Floor.findByPk(id);
    if (!building) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Floor not found",
        data: null,
      });
    }
    await building.update({
      buildingId,
      name,
      description,
      image,
    });
    const updatedFloor = await db.Floor.findByPk(id, { raw: true });
    return res.status(200).json({
      success: true,
      message: "Floor created successfully",
      data: updatedFloor,
    });
  } catch (error) {
    next(error);
  }
};

const getFloorScenes = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "floor id is required",
        data: null,
      });
    }
    const floor = await db.Floor.findByPk(id, {
      include: [{ model: db.Scene, as: "scenes" }],
    });

    if (!floor) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Room not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room scenes fetched successfully",
      data: floor.scenes, // Changed from floor.Scene to floor.scenes
    });
  } catch (error) {
    next(error);
  }
};

const getFloorRooms = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "ID is required",
        data: null,
      });
    const floor = await db.Floor.findOne({
      where: { id },
      include: {
        model: db.Room,
        as: "rooms",
      },
    });
    return res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      data: floor.rooms,
    });
  } catch (error) {
    next(error);
  }
};
export {
  createNewFloor,
  getFloor,
  deleteFloor,
  updateFloor,
  getFloorRooms,
  getFloorScenes,
};
