import jwt from "jsonwebtoken";


export const createNew=async(req,res)=>{
   try {
      const {userId,username}=req.body
      const token = jwt.sign(
        {
          username: username,
          id: userId,
        },
        process.env.JWT_KEY,
        { expiresIn: "7d" }
      );

      res.status(200).json({token})
   } catch (error) {
    res.status(500).json(error)
   }
}