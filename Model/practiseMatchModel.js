import mongoose from "mongoose"

const PractiseMatchSchema = mongoose.Schema(
    {
      
      members:{
        type:Array,
      },
      type:{
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

      
    },
    
    { timestamps: true }
  );
  
  const PractiseModel = mongoose.model("practisematch", PractiseMatchSchema);
  
  export default PractiseModel;
  