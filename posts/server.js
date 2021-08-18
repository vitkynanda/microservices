//Dependencies
const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

//Initialize
const app = express();
const port = 4000;
const posts = {};

//Middleware
app.use(bodyParser.json());
app.use(cors());

//Read route
app.get("/posts", (req, res) => {
  //send response all posts data
  res.send(posts);
});

//Create post route
app.post("/posts", async (req, res) => {
  //generate id from randomBytes
  const id = randomBytes(4).toString("hex");
  //destructure request title from frontend
  const { title } = req.body;
  //create new post data
  posts[id] = {
    id,
    title,
  };
  //Send Post Created Data to event-bus
  await axios.post("http://localhost:4004/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });
  //make response status created and send back the post id as a response
  res.status(201).send(posts[id]);
});

//Handle post request from event-bus
app.post("/events", (req, res) => {
  console.log("Event received :", req.body.type);
  res.send({});
});

//Server post running
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
