//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

//Initialize
const app = express();
const port = 4001;
const commentsByPostId = {};

//Middleware
app.use(bodyParser.json());
app.use(cors());

//Read route
app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

//Create route (comments)
app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;
  console.log(content);
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[req.params.id] = comments;

  //Send comments data to event-bus
  await axios.post("http://localhost:4003/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
    },
  });
  res.status(201).send(comments);
});

//Post request from event-bus
app.post("/events", (req, res) => {
  console.log("Event received :", req.body.type);
  res.send({});
});

//Server comment running
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
