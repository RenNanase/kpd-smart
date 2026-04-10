/**
 * Shared API contract and mock client entry points.
 * Replace mock usage with real HTTP calls when the PostgreSQL REST API exists.
 */
export { OpenApiInfo, REST_API_BASE, RestPaths } from '@ecommerce-system/api-contract';
export type { IsoDateTimeString } from '@ecommerce-system/types';
export { MockRestClient } from '@ecommerce-system/mock-data';
