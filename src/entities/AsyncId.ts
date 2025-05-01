import { randomUUID } from 'node:crypto';
import { AsyncLocalStorage } from 'node:async_hooks';

export class AsyncId {
  private readonly storage: AsyncLocalStorage<string>;
  private readonly id: string;

  constructor(id?: string) {
    this.storage = new AsyncLocalStorage<string>();
    this.id = id ?? randomUUID();
    this.storage.enterWith(this.id);
  }

  public get value(): string {
    return this.storage.getStore() ?? this.id;
  }
}
