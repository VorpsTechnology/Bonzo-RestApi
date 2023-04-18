import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_KEY;

const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, secret);
      req.body._id = decoded.id;
      next();
    } else {
      res.status(401).json("Authorisation failed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export default authMiddleWare;
