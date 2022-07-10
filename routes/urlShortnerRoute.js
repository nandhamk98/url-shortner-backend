import { Router } from "express";
import { urlShortner } from "../Models/urlShortnerModel.js";

const router = Router();

router.post("/create", async (req, res) => {
  const data = req.body;
  try {
    const newShortner = new urlShortner({
      ...data,
      count: 0,
    });

    console.log(data);
    await newShortner.save();
    res.status(200).json({ id: newShortner._id });
  } catch (err) {
    res.status(500).json(err);
  }
  return;
});

router.get("/get-shortners", async (req, res) => {
  const data = req.body;

  const shortners = await urlShortner.find(data);
  res.status(200).send(shortners);
});

router.post("/update-clicks", async (req, res) => {
  const data = req.body;
  const shortner = await urlShortner.findOne(data);
  const updateCount = {
    count: shortner.count + 1,
  };

  const newShortner = await urlShortner.updateOne(data, updateCount);

  res.status(200).send({ status: newShortner.acknowledged });
  return;
});

export const urlShortnerRouter = router;
