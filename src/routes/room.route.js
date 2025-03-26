import express from "express";
import * as controllers from "../controllers/room.controller";

const router = express.Router();

router.post("/", controllers.createNewRoom);
router.delete("/:id", controllers.deleteRoom);
router.put("/:id", controllers.updateRoom);
router.get("/:id", controllers.getRoom);
router.get("/", controllers.getAllRooms);

export default router;
