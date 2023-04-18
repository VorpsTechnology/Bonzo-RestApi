import PractiseModel from "../Model/practiseMatchModel.js";
import Tambola from "tambola-generator";
const tambola =Tambola.default

//create practice match
export const creatematch=async(req,res)=>{
try {
  console.log("haoo");
    const {createrId,type}=req.body
    let newMatch=PractiseModel({createrId:createrId})
          newMatch.members.push(createrId)
           newMatch.type=type
    // const user= await PractiseModel.find({createrId:createrId})
  
        const match=await newMatch.save()
        res.status(200).json({match}) 
} catch (error) {
    res.status(500).json(error)
    
}
    

}



//join match

export const joinmatch=async(req,res)=>{
   try {
    const {userId ,matchId}=req.body
    const match =await PractiseModel.findByIdAndUpdate(matchId, { $push:{members:userId}},{new:true})
   console.log(match)
    res.status(200).json({match})
   
   } catch (error) {
      res.status(200).json(error)
   }
}

//start a match
export const startmatch=async(req,res)=>{
try {
    const {matchId}=req.body
    const match =await PractiseModel.findById(matchId)
   if(match.members.length<=match.type){
    if(match.members.length >=1){

      const draw=tambola.getDrawSequence() //Returns numbers 1-90 scrambled
      const data = await PractiseModel.findByIdAndUpdate(matchId,{$set:{draw:draw}},{new:true})
      console.log(data)
         res.status(200).json({data})
     }else{
         res.status(401).json("wait for users")
     }
   }else{
      res.status(400).json("Game is already started")
   }
} catch (error) {
    res.status(500).json(error)
}
}

// get tickets
export const getTickets=async(req,res)=>{
 
try {
    const {ticketCount ,matchId ,userId}=req.body
    const matchData=await PractiseModel.findById(matchId)
    if(matchData){
      if(matchData.members.indexOf(userId) !== -1){
        console.log("haiiii")
        if(ticketCount<=3){
            const x  = tambola.generateTickets(ticketCount) //This generates 100 tambola tickets
            res.status(200).json({x})
        }else{
            res.status(400).json("ticket limit exceeds")
        }
    } else{
        res.status(400).json("User not found")
    } 
    }else{
       res.status(400).json("Match not found")
    }
 
} catch (error) {
    
}
}

//claim winner spots
export const claim=async(req,res)=>{
   try {
    const {claimType,userId,matchId}=req.body
    const matchData=await PractiseModel.findById(matchId)

    if(matchData.members.indexOf(userId)!==-1  ){
       if(claimType==="firstRow" && !matchData.firstRow){
           const data=await PractiseModel.findByIdAndUpdate(matchId,{firstRow:userId},{new:true})
        return   res.status(200).json({data})
       }
      else if(claimType==="secondRow" && !matchData.secondRow){
           const data=await PractiseModel.findByIdAndUpdate(matchId,{secondRow:userId},{new:true})
        return     res.status(200).json({data}) 
       }
       else if(claimType==="thirdRow" && !matchData.thirdRow){
           const data=await PractiseModel.findByIdAndUpdate(matchId,{thirdRow:userId},{new:true})
         return  res.status(200).json({data})
       }
       else if(claimType==="corner" && !matchData.corner){
           const data=await PractiseModel.findByIdAndUpdate(matchId,{corner:userId},{new:true})
           console.log(data);
         return  res.status(200).json({data})

       }
       else if(claimType==="tambola" && !matchData.tambola){
           const data=await PractiseModel.findByIdAndUpdate(matchId,{tambola:userId},{new:true})
         return  res.status(200).json({data})
       }else{
         return  res.status(400).json("already claimed ") 
       }

       
    }else{
       res.status(400).json("Cant find user")
    }
   } catch (error) {
      res.status(500).json(error)
   }
}

//remove match

export const removeMatch=async(req,res)=>{
  try {
    const {matchId}=req.body
    const match =await PractiseModel.findById(matchId)
    if(match){
      
   await PractiseModel.findByIdAndRemove(matchId)
   res.status(200).json("Match data deleted successfully")

    }    else{
      res.status(400).json("Match data not found")
    }  
    } catch (error) {
      res.status(500).json(error)
  }
}

//get all match

export const allMatch = async(req,res)=>{
  try {
     const data =await PractiseModel.find()
        const beta=data.reverse()
     
     res.status(200).json({beta})
  } catch (error) {
    res.status(500).json(error)
  }
}

