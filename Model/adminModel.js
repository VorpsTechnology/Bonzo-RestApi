import mongoose from "mongoose";

const adminGlobal = mongoose.Schema(
  {
    
    isAdmin: {
      type: Boolean,
      default: false,
    },

    isWalletHide:{
        type: Boolean,
        default: false,
    }
    
  },
  { timestamps: true }
);

const adminGlobalModel = mongoose.model("adminGlobal", adminGlobal);

export default adminGlobalModel;