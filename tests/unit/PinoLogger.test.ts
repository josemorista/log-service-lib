import { LogLevel, LogLevelSeverity } from '../../src/enums/LogLevel';
import { PinoLogger } from '../../src/infra/pino/PinoLogger';
import { Writable } from 'stream';

const makeSut = (lvl: LogLevel, destination: Writable) => {
  return new PinoLogger(lvl, { destination });
};

const stubTs = 1746129495449;
const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(stubTs);
const dummyMessage = {
  body: 'Woody is a nice toy',
  attributes: {
    owner: 'Andy',
  },
};
const expectedBaseInfoMessage = {
  severityText: 'INFO',
  timestamp: stubTs,
  isoTs: new Date(stubTs).toISOString(),
  severityNumber: LogLevelSeverity['info'],
  body: dummyMessage.body,
  attributes: dummyMessage.attributes,
};

describe('PinoLogger', () => {
  let logs: string[];
  const fakeDestination = new Writable({
    write(chunk, _, callback) {
      logs.push(chunk.toString());
      callback(null);
    },
  });

  beforeEach(() => {
    logs = [];
  });

  afterAll(() => {
    dateSpy.mockReset();
  });

  (
    [
      { level: 'trace', allowed: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'], disallowed: [] },
      { level: 'debug', allowed: ['debug', 'info', 'warn', 'error', 'fatal'], disallowed: ['trace'] },
      { level: 'info', allowed: ['info', 'warn', 'error', 'fatal'], disallowed: ['trace', 'debug'] },
      { level: 'warn', allowed: ['warn', 'error', 'fatal'], disallowed: ['trace', 'debug', 'info'] },
      { level: 'error', allowed: ['error', 'fatal'], disallowed: ['trace', 'debug', 'info', 'warn'] },
      { level: 'fatal', allowed: ['fatal'], disallowed: ['trace', 'debug', 'info', 'warn', 'error'] },
    ] as const
  ).forEach(({ level, allowed, disallowed }) => {
    describe(`When accepted log level is ${level}`, () => {
      const sut = makeSut(level, fakeDestination);

      it.each(allowed)(`should log correct message format with %s level when configured as ${level}`, (logLevel) => {
        sut[logLevel](dummyMessage);
        const loggedMsg = JSON.parse(logs[0]);
        expect(loggedMsg).toMatchObject({
          severityText: logLevel.toUpperCase(),
          timestamp: stubTs,
          isoTs: new Date(stubTs).toISOString(),
          severityNumber: LogLevelSeverity[logLevel],
          body: dummyMessage.body,
          attributes: dummyMessage.attributes,
        });
      });

      if (disallowed.length) {
        it.each(disallowed)(`should not log message with %s level when configured as ${level}`, (logLevel) => {
          sut[logLevel](dummyMessage);
          expect.any(Number);
          expect(logs[0]).toBeUndefined();
        });
      }
    });
  });

  describe('setTraceId', () => {
    const sut = makeSut('trace', fakeDestination);

    it('Should log messages with correct traceId', () => {
      sut.setTraceId();
      expect(sut.getTraceId()).toMatch(/\w{4}-\w{4}-\w{4}-\w{4}/);
      sut.info(dummyMessage);
      expect(JSON.parse(logs[0])).toMatchObject({
        ...expectedBaseInfoMessage,
        traceId: sut.getTraceId(),
      });
    });

    it('Should persist traceId if given', () => {
      const myTraceId = 'sid';
      sut.setTraceId(myTraceId);
      expect(sut.getTraceId()).toBe(myTraceId);
      sut.info(dummyMessage);
      expect(JSON.parse(logs[0])).toMatchObject({
        ...expectedBaseInfoMessage,
        traceId: myTraceId,
      });
    });
  });

  describe('getSpan', () => {
    const sut = makeSut('trace', fakeDestination);

    it('Should return span with correct name', () => {
      let span = sut.getSpan('ToysVacationService');
      expect(span.getSpanId()).toBe('ToysVacationService');
      span = span.getSpan('PoolService');
      expect(span.getSpanId()).toBe('ToysVacationService:PoolService');
    });

    it('Should log messages with correct spanId and duration', () => {
      const spanId = 'ToysVacationService';
      const span = sut.getSpan(spanId);
      span.info(dummyMessage);

      expect(JSON.parse(logs[0])).toMatchObject({ ...expectedBaseInfoMessage, spanId, duration: expect.any(Number) });
    });

    it('Should persist traceId within spans', () => {
      sut.setTraceId();
      const spanId = 'ToysVacationService';
      const span = sut.getSpan(spanId);
      span.info(dummyMessage);

      expect(JSON.parse(logs[0])).toMatchObject({
        ...expectedBaseInfoMessage,
        spanId,
        duration: expect.any(Number),
        traceId: sut.getTraceId(),
      });
    });
  });
});
