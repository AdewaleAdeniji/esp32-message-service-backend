const express = require("express");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { AddMessageToQueue, GetCachedMessageController, GetMessagesFromDB, GetSingleMessageController, GetViewMessageController, GetQueuesController, UpdateQueueController } = require("./controllers/Message");
const { addMessagesToCache } = require("./services/cache");
require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/queue/add", AddMessageToQueue);
app.get("/queue/cached", GetCachedMessageController);
app.get("/queue/single/:appID", GetSingleMessageController);
app.get("/queue/view/:appID", GetViewMessageController);
app.get("/queues", GetQueuesController);
app.put("/queues/:appID/:queueIndex", UpdateQueueController);

app.get("/health", (_, res) => {
  return res.status(200).send("OK");
});
app.get("*", (_, res) => {
  return res.status(404).send("Not found");
});
app.post("*", (_, res) => {
  return res.status(404).send("Not found");
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.APP_DB, // specify the database name here
  })
  .then(async () => {
    console.log("connected to mongodb")
    // put all messages to cache 
    const messages = await GetMessagesFromDB();
    await addMessagesToCache(messages);
  })
  .catch((err) => {
    console.log(err)
    console.log("error occured connecting to mongodb")
});

app.listen(process.env.PORT || 3003, () => {
  console.log(`Server is running on port ${process.env.PORT || 3003}`);
});
