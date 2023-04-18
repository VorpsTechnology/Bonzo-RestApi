import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      
    
    },
    password: {
      type: String,
 
    },
    firstName: {
      type: String,

    },
    lastName: {
      type: String,

    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: Number,
      unique:true
    },
    wallet: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    AgreePrivacyPolicy: {
      type: Boolean,
      default: false,
    },
    totalWinnings: {
      type: Number,
      default:0
    },
    kyc: {
      type: String,
    },
    totalMatches: {
      type: Number,
      default:0
    },
    language: {
      type: String,
      default: "English",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    email:{
        type:String,
    
    },
    promoCode:{
      type:String,
    },
    guestUser:{
      type:String
    }
    
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
