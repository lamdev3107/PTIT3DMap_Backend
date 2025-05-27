import { errorHandlingMiddleware } from "../middlewares/errorHandlingMiddleware";
import buildingRouter from "./building.route";
import floorRouter from "./floor.route";
import roomRouter from "./room.route";
import navigationRouter from "./navigation.route";
import sceneRouter from "./scene.route";
import authRouter from "./auth.route";
import homeRouter from "./home.route";
const initRoutes = (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/buildings", buildingRouter);
  app.use("/api/floors", floorRouter);
  app.use("/api/rooms", roomRouter);
  app.use("/api/scenes", sceneRouter);
  app.use("/api/navigations", navigationRouter);
  app.use("/api/home", homeRouter);

  //Error handling
  app.use(errorHandlingMiddleware);

  return app.use("/", (req, res) => {
    res.send("server on...");
  });
};

export default initRoutes;
