import kycuserWalletModel from "../Model/kycWalletMOdel.js";



export const create=async(req,res)=>{
try {
    const {userId,kyc}=req.body
    const wallet=kycuserWalletModel({ownerId:userId,kyc:kyc})
    await wallet.save()
} catch (error) {
   res.status(500).json(error) 
}
}


