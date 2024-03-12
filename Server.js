import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoute from "./Routes/AuthRoute.js";
import helmet from "helmet";
import UserRoute from "./Routes/UserRoute.js";
import PracticeMatch from "./Routes/PractiseMatch.js"
import RoomMatch from "./Routes/RoomMatch.js"
import GuestUser from "./Routes/GuestUser.js"
import CashInOut from "./Routes/CashInOutRoute.js"
import SupportRoute from "./Routes/SupportRoute.js"
import JwtRoute from "./Routes/jwtRoute.js"
import KycRoute from "./Routes/KycWalletRoute.js"
import verifyKyc from "./Routes/kycverifyRoute.js"
import newGameRoute from "./Routes/newGameRouter.js"
import adminRoute from "./Routes/adminRoute.js"
const app = express();
//limiting the request storage
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
//implementing helmet
app.use(helmet());
//cors origin
app.use(cors());
//dot env file config
dotenv.config();
//server

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log("Listening @ PORT", process.env.PORT)
    );
  })
  .catch((err) => {
    console.log(err);
  });
//Routes

app.use("/api/:id", (req, res, next) => {
  const apikey = req.params.id;
  if (apikey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json("Api access denied");
  }
});

app.use("/api/:id/auth", AuthRoute);
app.use("/api/:id/user", UserRoute);
app.use("/api/:id/practise", PracticeMatch )
app.use("/api/:id/room", RoomMatch)
app.use("/api/:id/guestuser",GuestUser)
app.use("/api/:id/cashinout",CashInOut)
app.use("/api/:id/support",SupportRoute)
app.use("/api/:id/jwt",JwtRoute)
app.use("/kycwallet",KycRoute)
app.use("/verify",verifyKyc)
app.use("/newgame",newGameRoute)
app.use("/api/:id/adminstate",adminRoute)


 

