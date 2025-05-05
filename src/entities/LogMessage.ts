import { LogLevel, LogLevelSeverity } from '../enums/LogLevel';

export type LogMessageInput = Omit<LogMessage, 'timestamp' | 'severityNumber' | 'isoTs' | 'severityText'> & {
  level: LogLevel;
};

export class LogMessage {
  timestamp: number;
  isoTs: string;
  severityNumber: number;
  severityText: string;
  body: string;
  attributes?: Record<string, unknown>;
  traceId?: string;
  spanId?: string;
  duration?: number;

  constructor(options: LogMessageInput) {
    this.timestamp = Date.now();
    this.isoTs = new Date(this.timestamp).toISOString();
    this.severityText = options.level.toUpperCase();
    this.severityNumber = LogLevelSeverity[options.level];
    this.body = options.body;
    this.attributes = options.attributes;
    this.traceId = options.traceId;
    this.spanId = options.spanId;
    this.duration = options.duration;
  }
}
