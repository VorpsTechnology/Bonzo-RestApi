import jwt from "jsonwebtoken";
import UserModel from "../Model/userModel.js";

export const createNew=async(req,res)=>{
   try {
     console.log("haiii");
      const {userId,userName}=req.body
console.log("log",userId,userName);
      const user = await UserModel.findOne({ username: userName });
     if(user){
      const token = jwt.sign(
        {
          username: user.username,
          id: user._id,
        },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({ user, token });
     }else{
      res.status(400).json({message:"not found" });
     }
   } catch (error) {
    res.status(500).json(error)
   }
}