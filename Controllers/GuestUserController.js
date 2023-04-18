import GuestUserModel from "../Model/guestUserModel.js";
import UserModel from "../Model/userModel.js";  
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userWalletModel from "../Model/userWalletModel.js";
export const createGuestUser=async(req,res)=>{
  // const { username } = req.body;
   
   const newUser = GuestUserModel(req.body);
   
   try {
    const {username}=req.body
    const oldUser = await GuestUserModel.findOne({ username });
    if(!oldUser){
        const user = await newUser.save();
        if(user){
            res.status(200).json({user})
        }else{
            res.status(400).json({errMessage:"Cant save guestUser information"})
        }
    }else{
        res.status(401).json({errMessage:" username already used"})
    }
   } catch (error) {
      res.status(500).json({error})
   }

}

export const changeGuestAccount= async (req,res)=>{

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
  
    try {
      //Local signup
      if (req.body.authType === "Local") {
        const { username } = req.body;
        const { authTtype, ...others } = req.body;
        const newUser =  UserModel(others);
         
        if (username) {
          const oldUser = await UserModel.findOne({ username });
          if (oldUser) {
            return res.status(400).json({ message: "username already exist" });
          }
          const user = await newUser.save();
          const wallet=userWalletModel({ownerId:user._id})
          await wallet.save()
          const token  = jwt.sign(
            {
              username: user.username,
              id: user._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
           res.status(200).json({ user, token });
        } else {
          res.status(401).json("Username not found");
        }
      } 
     //Otp signup 
      
      else if (req.body.authType === "Otp") {
        const { mobile } = req.body;
        const { authTtype, ...others } = req.body;
        const newUser = UserModel(others);
        if (mobile) {
          const oldUser = await UserModel.findOne({ mobile });
          if (oldUser) {
            return res
              .status(400)
              .json({ message: "mobile number already exist" });
          }
          const user = await newUser.save();
          const token = jwt.sign(
            {
              username: user.mobile,
              id: user._id,
            },  
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          return res.status(200).json({ user, token });
        } else {
          res.status(401).json("Mobile not found");
        }
      } else if (req.body.authType === "Google") {
        const { email } = req.body;
        const { authTtype, ...others } = req.body;
        const newUser = UserModel(others);
        if (email) {
          const oldUser = await UserModel.findOne({ email });
          if (oldUser) {
            return res.status(400).json({ message: "email already exist" });
          }
          const user = await newUser.save();
          const wallet=userWalletModel({
            ownerId:user._id,
            defaultAmount:10,
            userAddedAmount:0,  
            winningAmount:0,
            totalUsableAmount:0
          
          
          })
          await wallet.save()
          const token = jwt.sign(
            {
              username: user.email,
              id: user._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          return res.status(200).json({ user, token });
        } else {
          res.status(401).json("Email not found");
        }
      } else {
        res.status(400).json("Invalid auth method");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }


}