import express from "express";
import * as controllers from "../controllers/building.controller";

const router = express.Router();

router.get("/", controllers.getAllBuildings);
router.get("/:id", controllers.getBuilding);

router.post("/", controllers.createNewBuilding);
router.delete("/:id", controllers.deleteBuilding);
router.put("/:id", controllers.updateBuilding);

export default router;
