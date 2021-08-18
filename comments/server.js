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
  //generate random if from randomBytes
  const commentId = randomBytes(4).toString("hex");
  //destruture content created from frontend blog request
  const { content } = req.body;
  //create comment contain post id
  const comments = commentsByPostId[req.params.id] || [];
  //push new comment to comments array
  comments.push({ id: commentId, content, status: "pending" });
  //
  commentsByPostId[req.params.id] = comments;

  //Send comments data to event-bus
  await axios.post("http://localhost:4004/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });
  res.status(201).send(comments);
});

//handle post request from event-bus
app.post("/events", async (req, res) => {
  console.log("Event received :", req.body.type);
  const { type, data } = req.body;
  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
    await axios.post("http://localhost:4004/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        content,
        postId,
      },
    });
  }
  res.send({});
});

//Server comment running
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
