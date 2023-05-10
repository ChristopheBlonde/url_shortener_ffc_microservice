const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

app.use(cors());

const htmlFile = __dirname + "/public/index.html";
const assets = __dirname + "/assets";

app.use("/assets", express.static(assets));

app.get("/", (req, res) => {
  res.status(200).sendFile(htmlFile);
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Page not found" });
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Server start on port ${listener.address().port}`);
});
