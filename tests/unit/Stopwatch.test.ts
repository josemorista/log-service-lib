import { Stopwatch } from '../../src/entities/Stopwatch';

const sleep = (amount: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, amount);
  });
};

describe('Stopwatch', () => {
  it('Should get elapsed time on getTime calls', async () => {
    const sut = new Stopwatch();
    await sleep(1000);
    expect(sut.getTime()).toBeGreaterThan(1000);
  });

  it('Should clear stopwatch when clear is called', async () => {
    const sut = new Stopwatch();
    await sleep(1000);
    expect(sut.getTime()).toBeGreaterThan(1000);
    sut.clear();
    expect(sut.getTime()).toBeLessThan(1000);
  });
});
