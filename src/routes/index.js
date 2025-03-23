import { errorHandlingMiddleware } from "../middlewares/errorHandlingMiddleware";
import buildingRouter from "./building.route";
const initRoutes = (app) => {
  app.use("/api/buildings", buildingRouter);
  //   app.use("/api/v1/insert", insertRouter);
  //   app.use("/api/v1/categories", categoryRouter);
  //   app.use("/api/v1/posts", postRouter);
  //   app.use("/api/v1/users", userRouter);
  //   app.use("/api/v1/post-types", postTypeRouter);
  //   app.use("/api/v1/post-packages", postPackageRouter);
  //   app.use("/api/v1/time-packages", timePackageRouter);
  //   app.use("/api/v1/attributes", attributeRouter);
  //   app.use("/api/v1/post-payments", postPaymentRouter);
  //   app.use("/api/v1/me", meRouter);
  //   app.use("/api/v1/payment", paymentRouter);

  //Error handling
  app.use(errorHandlingMiddleware);

  return app.use("/", (req, res) => {
    res.send("server on...");
  });
};

export default initRoutes;
