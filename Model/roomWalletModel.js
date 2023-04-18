import mongoose from "mongoose"

const roomWalletSchema = mongoose.Schema(
    {
      
      roomId:{
        type:String,


        
      },
      walletAmount:{
        type:Number,
        default:0
      },
      walletPassword:{
        type:String,
      },
      practiseWin:{
        type:String,
      },
      depositeStatus:{
        type:Boolean
      }
    },
    
    { timestamps: true }                                      
  );
  
  const roomWalletModel = mongoose.model("roomWallet", roomWalletSchema);
  
  export default roomWalletModel ;    