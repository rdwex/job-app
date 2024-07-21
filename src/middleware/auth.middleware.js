import jwt from "jsonwebtoken";
import User from "../../DB/modules/user.model.js";

export const auth = () => {
  return async (req, res, next) => {
    const token = req.header("token").replace("token ", "");

    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    const data = jwt.verify(token, "access_token");

    if (!data?.userId) {
      return res.json("Invalid token payload");
    }

    const isUserExists = await User.findById(data?.userId).select("-password");
    if (!isUserExists) {
      return res.json("User Not Found");
    }

    req.authUser = isUserExists;
    next();
  };
};
