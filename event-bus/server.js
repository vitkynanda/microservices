const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 4004;

// Middelware
app.use(bodyParser.json());
app.use(cors());

app.post("/events", (req, res) => {
  const event = req.body;
  //send event to all server
  axios.post("http://localhost:4000/events", event); //posts server
  axios.post("http://localhost:4001/events", event); //comments server
  axios.post("http://localhost:4002/events", event); //query server
  axios.post("http://localhost:4003/events", event); //moderation server
  res.send({ status: "OK" });
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
