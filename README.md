# Log Service Library OTEL

This library provides a logging service with various log levels and features, built on top of the Pino logging library. It allows you to log messages with structured data, manage trace IDs, and create spans for better observability.

## Installation

```bash
npm install log-service-lib
```

## Usage

### Importing the Library

```typescript
import { createLogger, LogLevel } from 'log-service-lib';
```

### Creating a Logger Instance

You can create a logger instance by using the `createLogger` function. Specify the accepted log level and optional infrastructure configurations.

```typescript
const logger = createLogger({
  acceptedLogLevel: LogLevel.info,
});
```

### Logging Messages

The logger supports multiple log levels: `trace`, `debug`, `info`, `warn`, `error`, and `fatal`. Each log level can be used as a method on the logger instance.

```typescript
logger.info({
  body: 'This is an informational message',
  attributes: { user: 'John Doe' },
});

logger.error({
  body: 'An error occurred',
  attributes: { errorCode: 500 },
});
```

### Managing Trace IDs

You can set and retrieve trace IDs for better traceability.

```typescript
logger.setTraceId();
console.log(logger.getTraceId()); // Outputs a generated trace ID

logger.setTraceId('custom-trace-id');
console.log(logger.getTraceId()); // Outputs 'custom-trace-id'
```

### Using Spans

Spans allow you to group logs under a specific context. You can create nested spans for hierarchical logging.

```typescript
const span = logger.getSpan('UserService');
span.info({
  body: 'User service started',
  attributes: { service: 'UserService' },
});

const nestedSpan = span.getSpan('DatabaseQuery');
nestedSpan.debug({
  body: 'Querying database',
  attributes: { query: 'SELECT * FROM users' },
});
```

### Configuration Options

The `createLogger` function accepts the following options:

- `acceptedLogLevel`: The minimum log level to accept (e.g., `LogLevel.info`).
- `infra.pino`: Optional Pino-specific configurations.

## License

This library is open-source and available under the MIT License.
