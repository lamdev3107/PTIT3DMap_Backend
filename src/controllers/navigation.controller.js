import db from "../models";

const getAllNavigations = async (req, res, next) => {
  try {
    const navigations = await db.Navigation.findAll({});

    return res.status(200).json({
      success: true,
      message: "Navigations fetched successfully",
      data: navigations,
    });
  } catch (error) {
    next(error);
  }
};
export { getAllNavigations };
