const generateID = () => {
  const timestamp = new Date().getTime().toString(); // get current timestamp as string
  const random = Math.random().toString().substr(2, 5); // generate a random string of length 5
  const userId = timestamp + random; // concatenate the timestamp and random strings
  return generateRandomString(7) + userId + generateRandomString(5);
};

const WrapHandler = (controllerFn) => {
  return async (req, res, next) => {
    try {
      await controllerFn(req, res, next);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  };
};
const validateRequest = (obj, keys) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const words = key.split(/(?=[A-Z])/); // Split the key based on capital letters
    const humanReadableKey = words.join(" "); // Join the words with spaces
    const formattedKey =
      humanReadableKey.charAt(0).toUpperCase() + humanReadableKey.slice(1); // Capitalize the first letter
    if (!(key in obj)) {
      return { message: `${formattedKey} is required` };
    }
    if (key in obj && obj[key] === "") {
      return { message: `${formattedKey} is required` };
    }
  }
  return false;
};
const generateRandomString = (length = 7) => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let email = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    email += characters.charAt(randomIndex);
  }
  return email;
};

module.exports = {
  generateID,
  WrapHandler,
  validateRequest,
  generateRandomString,
};
