import { Router } from "express";
import { user } from "../Models/userModel.js";
import bcrypt from "bcrypt";

const router = new Router();

router.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new user({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({ id: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "username already exists" });
  }
  return;
});

router.post("/login", async (req, res) => {
  try {
    const val = await user.findOne({ username: req.body.username });

    if (val) {
      const password = await bcrypt.compare(req.body.password, val.password);
      if (!password) {
        res.status(500).json({ message: "username or password not valid" });
      } else {
        res.status(200).json({ id: val._id });
      }
    } else {
      res.status(500).json({ message: "username not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Invalid credentials" });
  }
  return;
});

export const userRouter = router;
