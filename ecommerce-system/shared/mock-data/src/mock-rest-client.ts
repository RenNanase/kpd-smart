import { RestPaths } from '@ecommerce-system/api-contract';

export type MockRestClientOptions = {
  /** Artificial latency in ms (default 0). */
  latencyMs?: number;
};

/**
 * In-memory mock REST client. Swap for `fetch`/`HttpClient` against a real
 * PostgreSQL-backed API when available; keep response shapes aligned with
 * `@ecommerce-system/types` and `@ecommerce-system/api-contract`.
 */
export class MockRestClient {
  private readonly latencyMs: number;

  constructor(options: MockRestClientOptions = {}) {
    this.latencyMs = options.latencyMs ?? 0;
  }

  async getJson<T>(path: string): Promise<T> {
    await this.delay();
    if (path === RestPaths.health) {
      return { status: 'ok' } as T;
    }
    throw new Error(`MockRestClient: unhandled GET ${path}`);
  }

  private delay(): Promise<void> {
    if (this.latencyMs <= 0) {
      return Promise.resolve();
    }
    return new Promise((resolve) => setTimeout(resolve, this.latencyMs));
  }
}
