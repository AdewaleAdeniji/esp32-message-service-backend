const NodeCache = require("node-cache");
const { MessageCacheKey } = require("../constants");
const myCache = new NodeCache({ stdTTL: 60000, checkperiod: 120 });

exports.setToCache = (key, obj) => {
  myCache.set(key, obj);
};
exports.getFromCache = (key) => {
  const value = myCache.get(key);
  if (value == undefined) {
    // handle miss!
    return false;
  }
  return value;
};

exports.getMessageFromCache = async () => {
  const messages = await this.getFromCache(MessageCacheKey);
  return messages;
};

exports.addMessageToCache = async (messageID, message) => {
  var messages = await this.getMessageFromCache();
  if (!messages) {
    messages = [];
  }
  const found = false;
  messages.forEach((msg, index) => {
    // console.log(msg.messageID, message);
    if (msg.messageID === messageID) {
      found = true;
    }
  });
  if (!found) {
    messages.push(message);
  }
  await this.setToCache(MessageCacheKey, messages);
  return message;
};
exports.addMessagesToCache = async (messages) => {
  console.log("putting " + messages.length + " to cache");
  await this.setToCache(MessageCacheKey, messages);
};
