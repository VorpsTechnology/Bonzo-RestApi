 

import mongoose from "mongoose";

const GuestUserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      
    
    },
    type:{
        type:String,
        default:"GuestUser"
    }
   
   
   
  },
  { timestamps: true }
);

const GuestUserModel = mongoose.model("GuestUsers", GuestUserSchema);

export default GuestUserModel;
