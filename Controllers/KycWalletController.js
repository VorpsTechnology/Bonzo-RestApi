import kycuserWalletModel from "../Model/kycWalletMOdel.js";
import isuuid from '@zhangfuxing/isuuid'


export const create=async(req,res)=>{
try {
    const {userId,kyc}=req.body
    const wallet=kycuserWalletModel({ownerId:userId,kyc:kyc})
    await wallet.save()
} catch (error) {
   res.status(500).json(error) 
}
}


export const verify=async(req,res)=>{
    try {
        const {uuid}=req.body
       // is uuid
const response1=isuuid(str);  // true

// is uuid v1
const response2=isuuid(str, 1);  // true

// is uuid v2
const response3=isuuid(str, 2);  // false

// is uuid v3
const response4=isuuid(str, 3);  // false

// is uuid v4
const response5=isuuid(str, 4);  // false

// is uuid v5
const response6=isuuid(str, 5);  // false

const data={
    v:response1,
    v1:response2,
    v2:response3,
    v3:response4,
    v4:response5,
    v5:response6
}

res.status(200).json(data)
    } catch (error) {
        res.status(500).json(error) 
    }
}

