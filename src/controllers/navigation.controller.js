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

const getNavigationRooms = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rooms = await db.Room.findAll({
      where: {
        navigationId: id,
      },
      include: [
        {
          model: db.Floor,
          as: "floor",
          attributes: ["buildingId"],
        }, 
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Navigation rooms fetched successfully",
      data: rooms,  
    })
  } 
  catch (error) {
    next(error); 
  }
}
export { getAllNavigations, getNavigationRooms };
