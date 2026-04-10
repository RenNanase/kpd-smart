/**
 * REST path contract aligned with a future PostgreSQL-backed API.
 * Keep resource segments stable; version when breaking changes are required.
 */

export const API_VERSION = 'v1' as const;

/** Base path for all JSON REST handlers (Express/Nest/Fastify, etc.). */
export const REST_API_BASE = `/api/${API_VERSION}` as const;

/** Example health/readiness probe; extend with resources (products, orders, …). */
export const RestPaths = {
  health: `${REST_API_BASE}/health`,
} as const;

export type RestPathKey = keyof typeof RestPaths;
