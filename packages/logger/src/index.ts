import pino, { Logger, LoggerOptions } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const defaultOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  base: {
    env: process.env.NODE_ENV,
    service: process.env.SERVICE_NAME,
  },
  transport: isProduction
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
};

export const createLogger = (options: LoggerOptions = {}): Logger => {
  return pino({
    ...defaultOptions,
    ...options,
  });
};

export const logger = createLogger();

export type { Logger } from 'pino';
export default logger;
