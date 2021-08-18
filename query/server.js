//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

//Initialize
const app = express();
const port = 4002;
const posts = {};

//Middlleware
app.use(bodyParser.json());
app.use(cors());

//Read route
app.get("/posts", (req, res) => {
  //send response all posts created with all the comments
  res.send(posts);
});

//Handle post request from event-bus
app.post("/events", (req, res) => {
  //Destructure to get type and data from the event request
  const { type, data } = req.body;

  //if event type post, push data to array posts
  if (type === "PostCreated") {
    //Destructure to get id and title from the data
    const { id, title } = data;
    //create new post data with array comments
    posts[id] = { id, title, comments: [] };
  }

  //if event type comment, push data to array comments
  if (type === "CommentCreated") {
    //Destructure to get id, content, postId from the event
    const { id, content, postId, status } = data;
    //push comment created to array comments
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  //if event type comment update, update comments array data
  if (type === "CommentUpdated") {
    //Destructure to get id, content, postId from the event
    const { id, postId, content, status } = data;
    //take post with the postId
    const post = posts[postId];
    //take comment with the comment id
    const comment = post.comments.find((comment) => comment.id === id);
    //update comment status and content
    comment.status = status;
    comment.content = content;
  }

  res.send({});
});

//Server query running
app.listen(port, () => {
  console.log(`Server is listening in ${port}`);
});
