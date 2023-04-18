import UserModel from "../Model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userWalletModel from "../Model/userWalletModel.js"
//registering a new user
export const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass;

  try {
    //Local signup
    if (req.body.authType === "Local") {
      const { username } = req.body;
      const { authTtype, ...others } = req.body;
      const newUser = UserModel(others);
       
      if (username) {
        const oldUser = await UserModel.findOne({ username });
        if (oldUser) {
          return res.status(400).json({ message: "username already exist" });
        }
        const user = await newUser.save();
        const wallet=userWalletModel({ownerId:user._id})
        await wallet.save()
        const token = jwt.sign(
          {
            username: user.username,
            id: user._id,
          },
          process.env.JWT_KEY,
          { expiresIn: "7d" }
        );
         res.status(200).json({ user, token });
      } else {
        res.status(401).json("Username not found");
      }
    } 
   //Otp signup 
    
    else if (req.body.authType === "Otp") {
      const { mobile } = req.body;
      const { authTtype, ...others } = req.body;
      const newUser = UserModel(others);
      if (mobile) {
        const oldUser = await UserModel.findOne({ mobile });
        if (oldUser) {
          return res
            .status(400)
            .json({ message: "mobile number already exist" });
        }
        const user = await newUser.save();
        const token = jwt.sign(
          {
            username: user.mobile,
            id: user._id,
          },
          process.env.JWT_KEY,
          { expiresIn: "7d" }
        );
        return res.status(200).json({ user, token });
      } else {
        res.status(401).json("Mobile not found");
      }
    } else if (req.body.authType === "Google") {
      const { email } = req.body;
      const { authTtype, ...others } = req.body;
      const newUser = UserModel(others);
      if (email) {
        const oldUser = await UserModel.findOne({ email });
        if (oldUser) {
          return res.status(400).json({ message: "email already exist" });
        }
        const user = await newUser.save();
        const wallet=userWalletModel({
          ownerId:user._id,
          defaultAmount:10,
          userAddedAmount:0,
          winningAmount:0,
          totalUsableAmount:0
        
        
        })
        await wallet.save()
        const token = jwt.sign(
          {
            username: user.email,
            id: user._id,
          },
          process.env.JWT_KEY,
          { expiresIn: "7d" }
        );
        return res.status(200).json({ user, token });
      } else {
        res.status(401).json("Email not found");
      }
    } else {
      res.status(400).json("Invalid auth method");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login User

export const loginUser = async (req, res) => {
  try {
    if (req.body.username) {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username: username });
      if (user) {
        const validity = await bcrypt.compare(password, user.password);

        if (!validity) {
          res.status(400).json("Wrong password");
        } else if (user.isActive === false) {
          res.status(401).json("Action forbidden");
        } else {
          const token = jwt.sign(
            {
              username: user.username,
              id: user._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
          );

          res.status(200).json({ user, token });
        }
      } else {
        res.status(404).json("User does not exist");
      }
    } else if (req.body.mobile) {
      const { mobile, password } = req.body;
      const user = await UserModel.findOne({ mobile: mobile });
      if (user) {
        const validity = await bcrypt.compare(password, user.password);

        if (!validity) {
          res.status(400).json("Wrong password");
        } else if (user.isActive === false) {
          res.status(401).json("Action forbidden");
        } else {
          const token = jwt.sign(
            {
              username: user.mobile,
              id: user._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
          );

          res.status(200).json({ user, token });
        }
      } else {
        res.status(404).json("User does not exist");
      }
    } else if (req.body.email) {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user) {
        const validity = await bcrypt.compare(password, user.password);

        if (!validity) {
          res.status(400).json("Wrong password");
        } else if (user.isActive === false) {
          res.status(401).json("Action forbidden");
        } else {
          const token = jwt.sign(
            {
              username: user.email,
              id: user._id,
            },
            process.env.JWT_KEY,
            { expiresIn: "7d" }
          );

          res.status(200).json({ user, token });
        }
      } else {
        res.status(404).json("User does not exist");
      }
    } else {
      res.status(400).json("Invalid auth method");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
