"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// routes
const authRoute = require("./routes/authRoute");
const siswaRoute = require("./routes/siswaRoute");
const nilaiRoute = require("./routes/nilaiRoute");
const profileRoute = require("./routes/profileRoute");
const categoryRoute = require("./routes/categoryRoute");

const port = process.env.APP_PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

// global route
app.get("/", (req, res) => {
  res.send("Welcome");
});

// routes
app.use("/api", authRoute, nilaiRoute, siswaRoute, categoryRoute, profileRoute);

// unhandled route
app.all("*", (req, res) => {
  res.send("Sepertinya anda tersesat");
});

app.listen(port, () => {
  console.log("Running on port " + port);
});
