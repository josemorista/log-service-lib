import { AsyncId } from './AsyncId';
import { LogLevel } from '../enums/LogLevel';
import { LogMessage, LogMessageInput } from './LogMessage';

type MessageInput = Omit<LogMessageInput, 'traceId' | 'spanId' | 'level'>;

export abstract class Logger {
  private traceId?: AsyncId;
  private spanId?: AsyncId;
  public level: LogLevel;

  protected abstract _log(level: LogLevel, message: LogMessage): void;
  protected abstract _getChild(): Logger;

  constructor(level: LogLevel) {
    this.level = level;
  }

  private log(level: LogLevel, message: MessageInput) {
    this._log(
      level,
      new LogMessage({
        ...message,
        level,
        traceId: this.getTraceId(),
        spanId: this.getSpanId(),
      })
    );
  }

  setTraceId(traceId?: string) {
    this.traceId = new AsyncId(traceId);
  }

  getTraceId() {
    return this.traceId?.value;
  }

  getSpanId(): string {
    return this.spanId?.value || '#';
  }

  getSpan(name: string) {
    const span = this._getChild();
    span.traceId = this.traceId;
    span.spanId = new AsyncId(`${this.getSpanId()}:${name}`);
    return span;
  }

  trace(message: MessageInput) {
    this.log('trace', { ...message });
  }

  debug(message: MessageInput) {
    this.log('debug', message);
  }

  info(message: MessageInput) {
    this.log('info', message);
  }

  warn(message: MessageInput) {
    this.log('warn', message);
  }

  error(message: MessageInput) {
    this.log('error', message);
  }

  fatal(message: MessageInput) {
    this.log('fatal', message);
  }
}
