import express from "express";
const router = express.Router();
import * as controllers from "../controllers/auth.controller";

router.post("/login", controllers.login);


export default router;
