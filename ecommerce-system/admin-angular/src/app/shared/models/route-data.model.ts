import type { Permission } from './permissions.model';

/** Optional `data` on admin feature routes for RBAC. */
export interface AdminRouteData {
  /** Required permissions (see `permissionMode`). */
  permissions?: Permission[];
  /** `any` (default): user needs one of `permissions`. `all`: user needs every permission. */
  permissionMode?: 'any' | 'all';
}
