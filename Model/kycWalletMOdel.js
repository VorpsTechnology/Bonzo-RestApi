import mongoose from "mongoose"

const kycuserWalletSchema = mongoose.Schema(
    {
      
      ownerId:{
        type:String,  
      },
      userAddedAmount:{
        type:Number,
        default:0
      },
      winningAmount:{
        type:Number,
        default:0
      },
      totalUsableAmount:{
        type:Number,
        default:0
      },

      walletPassword:{
        type:String,
      },
     
    },
    
    { timestamps: true }
  );
  
  
  const kycuserWalletModel = mongoose.model("kycuserWallet", kycuserWalletSchema);
  
  export default kycuserWalletModel ;