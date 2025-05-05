import { AsyncId } from './AsyncId';
import { LogLevel } from '../enums/LogLevel';
import { LogMessage, LogMessageInput } from './LogMessage';
import { Stopwatch } from './Stopwatch';

type MessageInput = Omit<LogMessageInput, 'level' | 'traceId' | 'spanId' | 'duration'>;

export abstract class Logger {
  private traceId?: AsyncId;
  public level: LogLevel;

  private spanId?: string;
  private spanSpw?: Stopwatch;

  constructor(level: LogLevel) {
    this.level = level;
  }

  protected abstract _log(level: LogLevel, message: LogMessage): void;
  abstract getChild(): Logger;

  private log(level: LogLevel, message: MessageInput) {
    this._log(
      level,
      new LogMessage({
        ...message,
        level,
        traceId: this.getTraceId(),
        spanId: this.spanId,
        duration: this.spanSpw?.getTime(),
      })
    );
  }

  setTraceId(traceId?: string) {
    this.traceId = new AsyncId(traceId);
  }

  getTraceId() {
    return this.traceId?.value;
  }

  trace(message: MessageInput) {
    this.log('trace', message);
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

  getSpan(name: string) {
    const span = this.getChild();
    if (this.getTraceId()) span.setTraceId(this.getTraceId());
    span.spanId = this.spanId ? `${this.spanId}:${name}` : name;
    span.spanSpw = new Stopwatch();
    return span;
  }

  getSpanId() {
    return this.spanId;
  }
}
