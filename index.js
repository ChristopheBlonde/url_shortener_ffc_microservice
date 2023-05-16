const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Url = require("./assets/models/urlModel");

const app = express();

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true });

const htmlFile = __dirname + "/public/index.html";
const assets = __dirname + "/assets";

app.use(cors());
app.use("/assets", express.static(assets));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).sendFile(htmlFile);
});

app.get("/shorturl", async (req, res) => {
  try {
    const list = await Url.find().sort({ short_url: 1 });
    res.status(200).json(list);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/shorturl", async (req, res) => {
  const list = await Url.find();
  let num;
  if (list.length !== 0) {
    for (let i = 0; i < list.length; i++) {
      if (i !== list.length - 1) {
        if (list[i].short_url + 1 !== list[i + 1].short_url) {
          num = list[i].short_url + 1;
          break;
        }
      } else {
        num = list[i].short_url + 1;
      }
    }
  } else {
    num = 1;
  }

  let givenUrl;
  try {
    givenUrl = new URL(req.body.url);
  } catch (error) {
    console.log({ error });
  }
  if (givenUrl.protocol === "http:" || givenUrl.protocol === "https:") {
    const newShorturl = new Url({
      original_url: req.body.url,
      short_url: num,
    });
    await newShorturl
      .save()
      .then(() => {
        res.status(200).json(newShorturl);
      })
      .catch((err) => res.status(400).json(err));
  } else {
    res.status(200).json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:shorturl", async (req, res) => {
  try {
    const url = await Url.findOne({ short_url: req.params.shorturl });
    res.redirect(url.original_url);
  } catch (error) {
    res.status(400).json({ error: "Invalid short url" });
  }
});

app.delete("/api/shorturl/:shorturl", async (req, res) => {
  try {
    const urlDeleted = await Url.findOneAndRemove({
      short_url: Number(req.params.shorturl),
    });
    res.status(200).json(urlDeleted);
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Page not found" });
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Server start on port ${listener.address().port}`);
});
