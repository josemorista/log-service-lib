import { LogLevel } from './enums/LogLevel';
import { PinoLogger, PinoOptions } from './infra/pino/PinoLogger';

interface CreateLoggerOptions {
  acceptedLogLevel: LogLevel;
  infra?: {
    pino?: PinoOptions;
  };
}

const createLogger = (opts: CreateLoggerOptions) => {
  return new PinoLogger(opts.acceptedLogLevel, opts.infra?.pino);
};

export { LogLevel, createLogger };
