import { performance } from 'node:perf_hooks';

export class Stopwatch {
  private time: number;

  constructor() {
    this.time = performance.now();
  }

  clear() {
    this.time = performance.now();
  }

  getTime() {
    return performance.now() - this.time;
  }
}
