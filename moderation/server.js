const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const port = 4003;

app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { data, type } = req.body;
  console.log(data, type);
  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";
    await axios.post("http://localhost:4004/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        status: status,
        content: data.content,
        postId: data.postId,
      },
    });
  }
  res.send({});
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
