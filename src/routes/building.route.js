import express from "express";
import * as controllers from "../controllers/building.controller";

const router = express.Router();

router.get("/", controllers.getBuildings);

export default router;
