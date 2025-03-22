import * as services from "../services/bulding.service";

export const getBuilding = async (req, res) => {
  try {
    const response = await services.getBuildingsService();
    return res.status(200).json(response);
  } catch (error) {
    throw error;
  }
};
