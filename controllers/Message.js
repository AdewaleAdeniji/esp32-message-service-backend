const { QueueKey } = require("../constants");
const MessageModel = require("../models/Message");
const {
  getMessageFromCache,
  addMessageToCache,
  getFromCache,
  setToCache,
} = require("../services/cache");
const {
  WrapHandler,
  validateRequest,
  generateID,
} = require("../services/utils");

const AddMessageToQueue = WrapHandler(async (req, res) => {
  const body = req?.body;
  const val = validateRequest(body, ["message", "name", "metadata"]);
  if (val) return res.status(400).send(val);
  if (body.message.length > 16) {
    return res.status(400).send({ message: "message longer than 16" });
  }
  if (body.name.length > 16) {
    return res.status(400).send({ message: "message longer than 16" });
  }
  body.messageID = generateID();
  // save to db
  const create = await MessageModel.create(body);
  if (!create)
    return res.status(400).send({ message: "Failed to send message" });
  // push to cache
  addMessageToCache(body.messageID, body);
  const msgs = await GetCachedMessages();
  const mess = {
    message: body.message,
    name: body.name,
    messageID: body.messageID,
    queueIndex: msgs.length,
  };
  return res.status(200).send(mess);
});
const Template = WrapHandler(async (req, res) => {});
const GetCachedMessageController = WrapHandler(async (req, res) => {
  const messages = await GetCachedMessages();
  // console.log(messages);
  res.send(messages);
});
const GetMessages = async () => {
  const messages = await getMessageFromCache();
  if (!messages) return await MessageModel.find({});
  return messages;
};
const GetCachedMessages = async () => {
  const messages = await getMessageFromCache();
  if (!messages) return [];
  return messages;
};
const GetMessagesFromDB = async () => {
  const messages = await MessageModel.find({});
  return messages;
};
const GetSingleMessageController = WrapHandler(async (req, res) => {
  const appID = req.params.appID;
  var queueIndex = await getQueueIndex(appID);
  const messages = await GetMessages();
  //   console.log(queueIndex)
  //   console.log(queueIndex, messages.length)
  if (queueIndex >= messages.length || queueIndex < 0) {
    queueIndex = 0;
  }
  const message = messages[queueIndex];
  // save the last index sent
  const mess = {
    message: message.message,
    name: message.name,
    queueIndex,
    messageID: message.messageID,
  };
  await saveQueue(appID, queueIndex + 1);
  return res.send(mess);
});
const GetViewMessageController = WrapHandler(async (req, res) => {
  const appID = req.params.appID;
  var queueIndex = (await getQueueIndex(appID)) - 1;
  const messages = await GetMessages();
  //   console.log(queueIndex)
  //   console.log(queueIndex, messages.length)
  if (queueIndex >= messages.length || queueIndex < 0) {
    queueIndex = 0;
  }
  const message = messages[queueIndex];
  // save the last index sent
  const mess = {
    message: message.message,
    name: message.name,
    queueIndex,
    messageID: message.messageID,
  };
  // await saveQueue(appID, queueIndex + 1);
  return res.send(mess);
});
const saveQueue = async (appID, queueIndex) => {
  const queues = await getQueues();
  queues[appID] = queueIndex;
  await setToCache(QueueKey, queues);
  // console.log(queues);
};
const GetQueuesController = WrapHandler(async (req, res) => {
  const queues = await getQueues();
  return res.send(queues);
});
const getQueues = async () => {
  const queues = await getFromCache(QueueKey);
  return queues ? queues : {};
};
const getQueueIndex = async (appID) => {
  const queues = await getQueues();
  return queues[appID] || 0;
};
const UpdateQueueController = WrapHandler(async (req, res) => {
  const appID = req.params.appID;
  const queueIndex = req.params.queueIndex;
  await saveQueue(appID, queueIndex);
  const messages = await GetMessages();
  //   console.log(queueIndex)
  console.log(queueIndex, messages.length);
  if (queueIndex >= messages.length || queueIndex < 0) {
    return res.status(400).send({ message: "You cannot update to this index" });
  }
  const message = messages[queueIndex];
  // save the last index sent
  const mess = {
    message: message.message,
    name: message.name,
    queueIndex,
    messageID: message.messageID,
  };
  // await saveQueue(appID, queueIndex + 1);
  return res.send(mess);
});
module.exports = {
  GetMessages,
  AddMessageToQueue,
  GetCachedMessages,
  GetMessagesFromDB,
  GetCachedMessageController,
  GetSingleMessageController,
  GetViewMessageController,
  GetQueuesController,
  UpdateQueueController,
};
