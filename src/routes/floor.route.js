import express from "express";
import * as controllers from "../controllers/floor.controller";

const router = express.Router();

router.post("/", controllers.createNewFloor);
router.delete("/:id", controllers.deleteFloor);
router.put("/:id", controllers.updateFloor);
router.get("/:id", controllers.getFloor);
router.get("/:id/rooms", controllers.getFloorRooms);
router.get("/:id/scenes", controllers.getFloorScenes);

export default router;
