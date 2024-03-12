import adminGlobalModel from "../Model/adminModel.js";


export const getWalletState=async(req,res)=>{
        try {
    console.log("GETTING WALLET STATE");

            const walletState=await adminGlobalModel.find();
            const data= walletState;
            console.log(data);
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json(error)
        }
    };
    
    export const updateWalletState=async(req,res)=>{

        const {isWalletHide}=req.body
            try {
                console.log(req.body);
                const data= await adminGlobalModel.updateOne({isWalletHide:isWalletHide,},)
                const walletState=await adminGlobalModel.find();
                console.log(walletState);
                res.status(200).json(walletState)
            } catch (error) {
                res.status(500).json(error)
            }
        } 