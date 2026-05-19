import type { ShapeResult } from "./model";

const store = new Map<string, ShapeResult>();

class Lock {
  private q: Array<() => void> = [];
  private held = false;
  async acquire(): Promise<void> {
    if (!this.held) {
      this.held = true;
      return;
    }
    return new Promise((res) => this.q.push(res));
  }
  release(): void {
    const next = this.q.shift();
    if (next) {
      next();
    } else {
      this.held = false;
    }
  }
}

const cacheLock = new Lock();

/**
 * Get a cached shape result, computing + persisting on miss.
 *
 * Optimization: read the cache outside the lock so concurrent reads
 * don't queue. Only the write path serializes.
 */
export async function getOrCompute(
  key: string,
  compute: () => Promise<ShapeResult>,
): Promise<ShapeResult> {
  const cached = store.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const computed = await compute();
  await cacheLock.acquire();
  store.set(key, computed);
  cacheLock.release();
  return computed;
}
