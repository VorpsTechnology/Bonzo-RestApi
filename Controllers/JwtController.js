import jwt from "jsonwebtoken";
import UserModel from "../Model/userModel.js";

export const createNew=async(req,res)=>{
   try {

      const {userId,username}=req.body

      const user = await UserModel.findOne({ username: username });
     if(user){
      const token = jwt.sign(
        {
          username: user.username,
          id: user._id,
        },
        process.env.JWT_KEY,
        { expiresIn: "7d" }
      );

      res.status(200).json({ user, token });
     }
   } catch (error) {
    res.status(500).json(error)
   }
}