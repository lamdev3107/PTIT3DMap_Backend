import express from "express";
import * as controllers from "../controllers/building.controller";
import upload from "../middlewares/uploader";

const router = express.Router();

router.get("/", controllers.getAllBuildings);
router.get("/:id", controllers.getBuilding);
router.get("/:id/floors", controllers.getBuildingFloors);

router.post("/", upload.single("model"), controllers.createNewBuilding);
router.delete("/:id", controllers.deleteBuilding);
router.put("/:id", upload.single("model"), controllers.updateBuilding);

export default router;
