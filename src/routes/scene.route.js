import * as controllers from "../controllers/scene.controller.js";
import multer  from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import express from "express";
const router = express.Router();

router.post("/", upload.any(), controllers.createNewScene);
// router.delete("/:id", controllers.deleteScene);
// router.put("/:id", controllers.updateScene);
// router.get("/:id", controllers.getScene);

export default router;
