import mongoose from "mongoose";

const supportSchema = mongoose.Schema(
  {
    ownerId: {
      type: String,
    },
    lead1: {
      type: String,
     
    },
    lead2: {
        type: String,
       
      },
      lead3: {
        type: String,
       
      },
      status:{
        type:String,
        default:"Pending"
      }
  },
  { timestamps: true }
);

const supportModel = mongoose.model("support", supportSchema);

export default supportModel;