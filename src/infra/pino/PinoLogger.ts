import pino, { DestinationStream, LoggerOptions, Logger as PinoInstance } from 'pino';
import { Logger } from '../../entities/Logger';
import { LogMessage } from '../../entities/LogMessage';
import { LogLevel } from '../../enums/LogLevel';

export interface PinoOptions {
  config?: Omit<LoggerOptions, 'level' | 'timestamp' | 'base' | 'formatters'>;
  destination?: DestinationStream;
}

export class PinoLogger extends Logger {
  private readonly logger: PinoInstance;
  private options?: PinoOptions;

  constructor(level: LogLevel, options?: PinoOptions) {
    super(level);
    this.options = options;
    console.log(options);
    this.logger = pino(
      {
        ...(options?.config ?? {}),
        level,
        base: undefined,
        timestamp: false,
        formatters: {
          level(label) {
            return { severityText: label.toUpperCase() };
          },
        },
      },
      options?.destination ?? process.stdout
    );
  }

  protected _log(level: LogLevel, { severityText: _, ...rest }: LogMessage): void {
    this.logger[level](rest);
  }

  protected _getChild(): Logger {
    return new PinoLogger(this.level, this.options);
  }
}
