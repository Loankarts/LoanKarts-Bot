const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("🔥 Server chal raha hai bhai!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});