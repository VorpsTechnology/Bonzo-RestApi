import RoomModel from "../Model/roomMatchModel.js";
import Tambola from "tambola-generator";
const tambola =Tambola.default
import roomWalletModel from "../Model/roomWalletModel.js";
import userWalletModel from "../Model/userWalletModel.js";
import UserModel from "../Model/userModel.js";
import { AllOtherGames, RoomOfFive, RoomOfLessthanFive, RoomOfTen } from "../Helpers/winningFormulas.js";
import { json } from "express";

//create practice match
export const creatematch=async(req,res)=>{
try {

    const {createrId,type,fee}=req.body
    let newMatch=RoomModel({createrId:createrId})
          newMatch.members.push(createrId)
           newMatch.type=type
           newMatch.fee=fee
    // const user= await PractiseModel.find({createrId:createrId})
       
        const match=await newMatch.save()
        const wallet=roomWalletModel({
          roomId:match._id
        })
        await wallet.save()
        console.log("wallet created");
         await UserModel.findByIdAndUpdate(createrId,{$inc:{totalMatches:1}},{new:true})
        res.status(200).json({match}) 
} catch (error) {
    res.status(500).json(error)
      
}
    

}

//join match

export const joinmatch=async(req,res)=>{
   try {
    const {userId ,matchId}=req.body
    const match =await RoomModel.findById(matchId)
    if(match.members.length>match.type){
      res.status(400).json("Room is full")
    }else if(match.members.length<match.type && userId!==""){
      const match =await RoomModel.findByIdAndUpdate(matchId,{ $addToSet:{members:userId}},{new:true})
      await UserModel.findByIdAndUpdate(userId,{$inc:{totalMatches:1}},{new:true})
      res.status(200).json({match})
    }
     
   } catch (error) {
      res.status(200).json(error)
   }
}


//start a match
export const startmatch=async(req,res)=>{
  console.log("haiiii") 
try {
    const {matchId}=req.body
    const match =await RoomModel.findById(matchId)
    

      if(match.members.length == match.type && match.members.length ==match.ticketBuyerCount){
        if(match.draw.length>0){
          res.status(400).json("Game already started")
        }else{
          const draw=tambola.getDrawSequence() //Returns numbers 1-90 scrambled
          const data = await RoomModel.findByIdAndUpdate(matchId,{$set:{draw:draw}},{new:true})
          console.log(data)
             res.status(200).json({data})
        }
       
       }else{
           res.status(401).json("wait for users")
       }
    
} catch (error) {
    res.status(500).json(error)
}
}
// get tickets
export const getTickets=async(req,res)=>{
 
try {
    const {ticketCount ,matchId ,userId}=req.body
    const matchData=await RoomModel.findById(matchId)
    if(matchData){
      if(matchData.members.indexOf(userId) !== -1){
        console.log("haiiii")
        if(ticketCount<=3){

          
      
          const userWallet=await userWalletModel.findOne({ownerId:userId})
          console.log("hello",userWallet);
       
           if(userWallet.defaultAmount>=matchData.fee ){
            const x  = tambola.generateTickets(ticketCount) //This generates 100 tambola tickets
            await userWalletModel.findByIdAndUpdate(userWallet._id,{$inc:{defaultAmount:-matchData.fee}},{new:true})
            const matchWallet=await roomWalletModel.findOne({roomId:matchId})
            await roomWalletModel.findByIdAndUpdate(matchWallet._id,{$inc:{walletAmount:matchData.fee}},{new:true})
            await RoomModel.findByIdAndUpdate(matchData._id,{$inc:{ ticketBuyerCount:1}},{new:true})
            res.status(200).json({x})
           }else  if(userWallet.winningAmount>=matchData.fee  ){
            const x  = tambola.generateTickets(ticketCount) //This generates 100 tambola tickets
            await userWalletModel.findByIdAndUpdate(userWallet._id,{$inc:{ winningAmount:-matchData.fee}},{new:true})
            const matchWallet=await roomWalletModel.findOne({roomId:matchId})
            await roomWalletModel.findByIdAndUpdate(matchWallet._id,{$inc:{walletAmount:matchData.fee}},{new:true})
            await RoomModel.findByIdAndUpdate(matchData._id,{$inc:{ ticketBuyerCount:1}},{new:true})
            res.status(200).json({x})
           }


           
           else if( userWallet.userAddedAmount>=matchData.fee){
            const x  = tambola.generateTickets(ticketCount) //This generates 100 tambola tickets
            await userWalletModel.findByIdAndUpdate(userWallet._id,{$inc:{userAddedAmount:-matchData.fee}},{new:true})
            const matchWallet=await roomWalletModel.findOne({roomId:matchId})
            await roomWalletModel.findByIdAndUpdate(matchWallet._id,{$inc:{walletAmount:matchData.fee}},{new:true})
            await RoomModel.findByIdAndUpdate(matchData._id,{$inc:{ ticketBuyerCount:1}},{new:true})
            res.status(200).json({x})
           }else{   
            res.status(400).json("Insufficent Wallet amount")
          }
           
           
           
           
         
        }else{
            res.status(400).json("ticket limit exceeds")
        }
    }else{
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
    const matchData=await RoomModel.findById(matchId)
    const matchWallet =await roomWalletModel.findOne({roomId:matchId})
    let Distribution={}
    if(matchData.type<5){
      Distribution=RoomOfLessthanFive
    }else if(matchData.type==5){
      Distribution=RoomOfFive
    }
    else if(matchData.type==10){
      Distribution=RoomOfTen
    }
    else{
      Distribution=AllOtherGames
    }
    console.log(Distribution)
    let total =matchData.type*matchData.fee
    let TambolaWin=total*(Distribution.Tambola/100)
    let cornerWin=total*(Distribution.FirstFive/100)
    let firstRowWin=total*(Distribution.FirstRow/100)
    let secondRowWin=total*(Distribution.SecondRow/100)
    let thirdRowWin=total*(Distribution.ThirdRow/100)

    if(matchData.members.indexOf(userId)!==-1 ){
       if(claimType==="firstRow" && !matchData.firstRow){
           const data=await RoomModel.findByIdAndUpdate(matchId,{firstRow:userId},{new:true})
               
     await userWalletModel.findOneAndUpdate ({ownerId:userId},{$inc:{winningAmount:firstRowWin}},{new:true})
     await roomWalletModel.findOneAndUpdate ({roomId:matchData._id},{$inc:{walletAmount:-firstRowWin}},{new:true})
     await UserModel.findByIdAndUpdate(userId,{$inc:{totalWinnings:1}},{new:true})   

         const claimResponse={
           point:firstRowWin,
           claimtype:"First row claimed",
           userid:userId
         }
         return   res.status(200).json({claimResponse})
       }
      else if(claimType==="secondRow" && !matchData.secondRow){
           const data=await RoomModel.findByIdAndUpdate(matchId,{secondRow:userId},{new:true})
           await userWalletModel.findOneAndUpdate ({ownerId:userId},{$inc:{winningAmount:secondRowWin}},{new:true})
           await roomWalletModel.findOneAndUpdate ({roomId:matchData._id},{$inc:{walletAmount:-secondRowWin}},{new:true})
           await UserModel.findByIdAndUpdate(userId,{$inc:{totalWinnings:1}},{new:true})   
           const claimResponse={
            point:secondRowWin,
            claimtype:"Second row claimed",
            userid:userId
          }
          return   res.status(200).json({claimResponse})
       }
       else if(claimType==="thirdRow" && !matchData.thirdRow){
           const data=await RoomModel.findByIdAndUpdate(matchId,{thirdRow:userId},{new:true})
              
     await userWalletModel.findOneAndUpdate ({ownerId:userId},{$inc:{winningAmount:thirdRowWin}},{new:true})
     await roomWalletModel.findOneAndUpdate ({roomId:matchData._id},{$inc:{walletAmount:-thirdRowWin}},{new:true})
     await UserModel.findByIdAndUpdate(userId,{$inc:{totalWinnings:1}},{new:true})   
     const claimResponse={
      point:thirdRowWin,
      claimtype:"Third row claimed",
      userid:userId
    }
    return   res.status(200).json({claimResponse})
       }
       else if(claimType==="corner" && !matchData.corner){
           const data=await RoomModel.findByIdAndUpdate(matchId,{corner:userId},{new:true})
           console.log(data);


           await roomWalletModel.findOneAndUpdate ({roomId:matchData._id},{$inc:{walletAmount:-cornerWin}},{new:true})
     
           await userWalletModel.findOneAndUpdate ({ownerId:userId},{$inc:{winningAmount:cornerWin}},{new:true})
           await UserModel.findByIdAndUpdate(userId,{$inc:{totalWinnings:1}},{new:true})   
           const claimResponse={
            point:cornerWin,
            claimtype:"Corner claimed",
            userid:userId
          }
          return   res.status(200).json({claimResponse})

       }
       else if(claimType==="tambola" && !matchData.tambola){
           const data=await RoomModel.findByIdAndUpdate(matchId,{tambola:userId},{new:true})
           await roomWalletModel.findOneAndUpdate ({roomId:matchData._id},{$inc:{walletAmount:-TambolaWin}},{new:true})
     
           await userWalletModel.findOneAndUpdate ({ownerId:userId},{$inc:{winningAmount:TambolaWin}},{new:true})
           await UserModel.findByIdAndUpdate(userId,{$inc:{totalWinnings:1}},{new:true})   
           const claimResponse={
            point:TambolaWin,
            claimtype:"Tambola claimed",
            userid:userId
          }
          return   res.status(200).json({claimResponse})
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
    const match =await RoomModel.findById(matchId)
    if(match){
      
   await RoomModel.findByIdAndRemove(matchId)
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
     const data =await RoomModel.find()
        const beta=data.reverse()
     
     res.status(200).json({beta})
  } catch (error) {
    res.status(500).json(error)
  }
}


export const winners = async(req,res)=>{
  try {

    const {matchId}=req.body
    const match =await RoomModel.findById(matchId) 
  
    let winners={}
    winners.Tambola=match.tambola
    winners.Corner=match.corner
    winners.ThirdRow=match.thirdRow
    winners.FirstRow=match.firstRow
    winners.SecondRow=match.secondRow
   
     res.status(200).json(winners)
  } catch (error) {
    res.status(500).json(error)
  }
}         
  
export const getMemberCount=async(req,res)=>{
  try {
    const {matchId}=req.body
    const matchData=await RoomModel.findById(matchId)
    const count=matchData.members.length
    res.status(200).json(count)
  } catch (error) {
    res.status(500).json(error)
  }
}
  
export const leaveMatch =async(req,res)=>{
 
    try {
        const {matchId,userId}=req.body
        await RoomModel.findByIdAndUpdate(matchId,{$pull:{members:userId}})
        await RoomModel.findByIdAndUpdate(matchId,{$inc:{ ticketBuyerCount:-1}},{new:true})
        res.status(200).json("User left successfully")
    } catch (error) {
      res.status(500).json(error)
    }
} 

export const startPrivatematch=async(req,res)=>{
  console.log("haiiii") 
try {
    const {matchId}=req.body
    const match =await RoomModel.findById(matchId)
    

       if(match.draw.length>0){
          res.status(400).json("Game already started")
        }else{
          const draw=tambola.getDrawSequence() //Returns numbers 1-90 scrambled
          const data = await RoomModel.findByIdAndUpdate(matchId,{$set:{draw:draw}},{new:true})
          console.log(data) 
             res.status(200).json({data})
        }
       
       
    
} catch (error) {
    res.status(500).json(error)
}
}



export const leaderboard = async (req,res)=>{
  try {
    console.log(new Date( Date.now() - 7 * 24 * 60 * 60 * 1000));
    const data= await RoomModel.find({createdAt:{'$lte':new Date(),'$gte':new Date( Date.now() - 7 * 24 * 60 * 60 * 1000)}})
    const beta=await RoomModel.find({createdAt:{'$lte':new Date(),'$gte':new Date( Date.now() - 28 * 24 * 60 * 60 * 1000)}})
    var rez={};
data.forEach(function(item){
  rez[item.tambola] ? rez[item.tambola]++ :  rez[item.tambola] = 1;
});

var sez={};
beta.forEach(function(item){
  sez[item.tambola] ? sez[item.tambola]++ :  sez[item.tambola] = 1;
});

var {undefined,...otherrez}=rez
var {undefined,...othersez}=sez

const teta={
  weekly:otherrez,
  monthly:othersez
}


res.status(200).json(teta)
     
  } catch (error) {
   res.status(500).json(error)
  }
}
  