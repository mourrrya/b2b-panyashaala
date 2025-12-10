import path from "path";
import pino, { Logger } from "pino";

const logDirectory = path.join(process.cwd(), "logs");

// Determine if we're in production
const isProduction = process.env.NODE_ENV === "production";

const targets: any[] = isProduction
  ? [
      {
        target: "pino/file",
        options: { destination: path.join(logDirectory, "app.log"), mkdir: true },
      },
    ]
  : [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
          singleLine: false,
        },
      },
      {
        target: "pino/file",
        options: { destination: path.join(logDirectory, "dev.log"), mkdir: true },
      },
    ];

export const logger: Logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || "debug",
  },
  pino.transport({
    targets,
  }),
);
