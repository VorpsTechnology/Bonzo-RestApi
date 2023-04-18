import UserModel from "../Model/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import userWalletModel from "../Model/userWalletModel.js";
export const updateUser=async(req,res)=>{
    console.log("haiii");
    const id=req.params.id;
    const {_id,password}=req.body;
    
   


    if(id===_id ){
        try {

            if(password)
            {
              const salt =await bcrypt.genSalt(10)
              req.body.password= await bcrypt.hash(password,salt) 
            }
           const user =await UserModel.findByIdAndUpdate(id,req.body,{new:true})

          const token=jwt.sign({
            username:user.username,
            id:user._id
          },process.env.JWT_KEY,{expiresIn:"1h"})
           res.status(200).json({user,token})


        } catch (error) {
            res.status(500).json(error) 
        }
    }else{
        res.status(403).json("Access denied ! you can update only ypur own profile")
    }
}


export const getUserWallet=async(req,res)=>{

const {userId}=req.body
    try {
        const wallet=await userWalletModel.findOne({ownerId:userId})
        let totalUSable=wallet.winningAmount+wallet.userAddedAmount+wallet.defaultAmount
        const data= await userWalletModel.findOneAndUpdate ({ownerId:userId},{$set:{totalUsableAmount:totalUSable}},{new:true})
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error)
    }
} 


export const checkMobile=async(req,res)=>{
   
    try {
         const {mobile}=req.body

         const data= await UserModel.findOne({mobile:mobile})
         if(data){
            res.status(400).json("mobile already in use")
         }else{
            res.status(200).json("Number can be used")
         }
    } catch (error) {
        
    }




}
export const findAcount=async(req,res)=>{
 try {

  const {mobile}=req.body
  
       const data=await UserModel.findOne({mobile:mobile})
       if(data){
        const token = jwt.sign(
            {
              username: data.username,
              id: data._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          return res.status(200).json({data, token });
       }else{
        res.status(400).json("user not found")
       }

    
 } catch (error) {
    res.status(500).json(error)
 }
}



export const getuser=async(req,res)=>{
    try {
        const {userId}=req.body
        const data= await UserModel.findById(userId)
        const zeta={
            username:data.username,
            profile:data.profilePicture
        }
        res.status(200).json({zeta})
    } catch (error) {
        res.status(500).json(error)
    }
}


export const totalmatchandwinning=async(req,res)=>{
    try {
        const {userId}=req.body
        const data= await UserModel.findById(userId)
        let matchData={
            totalmatch:data.totalMatches ,
            totalwinning:data.totalWinnings
        }
        res.status(200).json(matchData)
    } catch (error) {
        res.status(500).json(error)
    }
}