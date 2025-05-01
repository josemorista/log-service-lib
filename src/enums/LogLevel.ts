export const LogLevelSeverity = {
  trace: 1,
  debug: 5,
  info: 9,
  warn: 13,
  error: 17,
  fatal: 21,
};

export type LogLevel = keyof typeof LogLevelSeverity;
