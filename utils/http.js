const axios = require("axios");

module.exports.sendRequest = async (config) => {
  const res = await axios(config);
  return res.data;
};
