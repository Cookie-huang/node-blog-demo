const mongoose = require("mongoose");
const config = require("config");
const logger = require("../middleware/logger");

// 连接数据库
module.exports = function () {
  const { URI, host, database, options } = config.get("dbConfig");
  const dbUri = `${URI}${host}/${database}`;

  mongoose
    .connect(dbUri, options)
    .then(() => logger.info("Connect to MongoDB..."));
  //   .catch(err => console.error("Could not connect to MongoDB..."));
};
