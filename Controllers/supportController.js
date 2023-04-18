import supportModel from "../Model/supportModel.js";


export const registerSupport=async(req,res)=>{
   try {
    const {Token,...others}=req.body

    const newSupport =new supportModel(others)

    const support =await newSupport.save()
    res.status(200).json(support)
   } catch (error) {
    res.status(500).json(error)
   } 
}