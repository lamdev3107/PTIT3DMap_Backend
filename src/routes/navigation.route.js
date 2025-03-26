import express from "express";
import * as controllers from "../controllers/navigation.controller";

const router = express.Router();

router.get("/", controllers.getAllNavigations);

export default router;
