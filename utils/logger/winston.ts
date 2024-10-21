import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize } = format;

export const winston = createLogger({
  format: combine(
    timestamp(),
    // colorize({ level: true, message: true }), // removed colorize as it messes up cloudwatch logs
    printf((info) => `[${info.timestamp}] : ${info.level}: ${info.message}`)
  ),
  exitOnError: false,
  transports: [new transports.Console()],
});
