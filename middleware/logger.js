const { createLogger, format, transports } = require("winston");
const path = require("path");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "your-service-name" },
  transports: [
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    new transports.File({
      filename: path.join(__dirname, "../log/error.log"),
      level: "error"
    }) // 错误类型日志
    // new transports.File({
    //   filename: path.join(__dirname, "../log/combined.log")
    // }) // 总日志集合
  ],
  exceptionHandlers: [
    new transports.File({
      filename: path.join(__dirname, "../log/exceptions.log")
    })
  ], // 同步 异常 日志
  rejectionHandlers: [
    new transports.File({
      filename: path.join(__dirname, "../log/rejections.log")
    })
  ] // 异步 异常日志
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple())
    })
  );
}

module.exports = logger;
