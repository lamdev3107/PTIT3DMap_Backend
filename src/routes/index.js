import { errorHandlingMiddleware } from "../middlewares/errorHandlingMiddleware";
import buildingRouter from "./building.route";
import floorRouter from "./floor.route";
import roomRouter from "./room.route";
import navigationRouter from "./navigation.route";
const initRoutes = (app) => {
  app.use("/api/buildings", buildingRouter);
  app.use("/api/floors", floorRouter);
  app.use("/api/rooms", roomRouter);
  app.use("/api/navigations", navigationRouter);

  //Error handling
  app.use(errorHandlingMiddleware);

  return app.use("/", (req, res) => {
    res.send("server on...");
  });
};

export default initRoutes;
