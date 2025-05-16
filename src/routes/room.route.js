import express from "express";
import * as controllers from "../controllers/room.controller";
import upload from "../middlewares/uploader";

const router = express.Router();

router.post("/", upload.single("model"), controllers.createNewRoom);
router.delete("/:id", controllers.deleteRoom);
router.get("/:id/scenes", controllers.getRoomScenes);
router.put("/:id", upload.single("model"), controllers.updateRoom);
router.get("/:id", controllers.getRoom);
router.get("/", controllers.getAllRooms);

export default router;
