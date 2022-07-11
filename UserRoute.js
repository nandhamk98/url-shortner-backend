import { Router } from "express";
import { user } from "./UserModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { google } from "googleapis";

dotenv.config();

const router = new Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const getMailContent = (type) => {
  if (type === "activateAccounnt") {
    return {
      subject: "Activation link for URL shortner App",
      message:
        "Hello Testing Google Api for Second time\n" +
        "https://poetic-custard-4bf4ac.netlify.app/activation-page/",
    };
  } else {
    return {
      subject: "Reset Password link for URL shortner App",
      message:
        "Hello Testing Google Api for Second time\n" +
        "https://poetic-custard-4bf4ac.netlify.app/reset-password/",
    };
  }
};

const sendMail = async (email, token, type) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER_NAME,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    let data = getMailContent(type);

    const mailOptions = {
      from: process.env.USER_NAME,
      to: email,
      subject: data.subject,
      text: data.message + token,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
};

router.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new user({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      activation: false,
    });

    await newUser.save();
    data = await sendMail(email, token, "activateAccounnt");
    res.status(200).json({ id: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "username already exists", err });
  }
  return;
});

router.post("/login", async (req, res) => {
  try {
    const val = await user.findOne({ email: req.body.email });
    if (val) {
      if (val.activation) {
        const password = await bcrypt.compare(req.body.password, val.password);
        if (!password) {
          res.status(500).json({ message: "username or password not valid" });
        } else {
          res.status(200).json({ id: val._id, username: val.firstname });
        }
      } else {
        res.send(403).json({ message: "Account is not activated" });
      }
    } else {
      res.status(500).json({ message: "email not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Invalid credentials" });
  }
  return;
});

router.post("/forgotPassword", async function (req, res) {
  let { email } = req.body;
  let token = Math.floor(Math.random() * Math.pow(10, 10));
  const postCheck = await user.findOne({ email: email });
  let data = "";
  console.log(postCheck);
  if (postCheck) {
    const update = await user.updateOne({ email: email }, { token: token });
    data = await sendMail(email, token, "resetPassword");
  }
  res.send(data);
  return;
});

router.post("/updatePassword", async function (req, res) {
  let { token, password } = req.body;
  token = parseInt(token);

  let checkData = await user.findOne({ token: token });
  if (checkData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    checkData = await user.updateOne(
      { token: token },
      {
        $set: { password: hashedPassword, nonHashedPassword: password },
        $unset: { token: token },
      }
    );
    res.send({ msg: "Succussfully updated password" });
  } else {
    res.status(400).send({ errorMsg: "Incorrect Token" });
  }
  return;
});

router.post("/activate-account", async (req, res) => {
  let { id } = req.body;
  let checkData = await user.findOne({ _id: id });
  if (checkData) {
    checkData = await user.updateOne({ _id: id }, { activation: true });
    res.status(200).send({ message: "Successfully activated account" });
  } else {
    res.status(500).send({ errorMsg: "Account doesn't exist" });
  }
  return;
});

export const userRouter = router;
