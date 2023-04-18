import mongoose from "mongoose"

const RoomMatchSchema = mongoose.Schema(
    {
      
      members:{
        type:Array,
      },
      type:{
        type:Number,
      },
      fee:{
        type:Number,
      },
      
      draw:{
        type:Array,
      },
      firstFive:{
        type:String
      },
      firstRow:{
        type:String
      },
      secondRow:{
        type:String
      },
      thirdRow:{
        type:String
      },

      corner:{
        type:String
      },
      tambola:{
        type:String
      },
      createrId:{
        type:String
      },
      ticketBuyerCount:{
        type:Number,
        default:0
      }
      
    },
    
    { timestamps: true }
  );
  
  const RoomModel = mongoose.model("roommatch", RoomMatchSchema);
  
  export default RoomModel ;



