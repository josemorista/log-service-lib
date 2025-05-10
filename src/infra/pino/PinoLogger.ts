import pino, { DestinationStream, LoggerOptions, Logger as PinoInstance } from 'pino';
import { Logger } from '../../entities/Logger';
import { LogMessage } from '../../entities/LogMessage';
import { LogLevel } from '../../enums/LogLevel';

export interface PinoOptions {
  config?: Omit<LoggerOptions, 'level' | 'timestamp' | 'base' | 'formatters'>;
  destination?: DestinationStream;
  _child?: boolean;
}

export class PinoLogger extends Logger {
  private logger!: PinoInstance;

  constructor(level: LogLevel, options?: PinoOptions) {
    super(level);
    if (!options?._child)
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

  getChild() {
    const span = new PinoLogger(this.level, { _child: true });
    span.logger = this.logger;
    return span;
  }
}
