import db from "../models";

const login = async (req, res, next) => {
    try {
      const payload = req.body;
      const user = await db.User.findOne({
        where: { email: payload?.email },
        raw: true,
      });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, mesage: "Invalid email or password" });
      }
      const isPasswordValid = user?.password == payload.password;
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: false, mesage: "Invalid email or password" });
      }
      const { password, ...returnedUser } = user;
  
      res
        .status(200)
        .json({ success: true, message: "Login successful", data: returnedUser });
    } catch (err) {
      next(err);
    }
};
export { login};
  