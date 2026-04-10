import type { Permission } from './permissions.model';

export interface NavItem {
  path: string;
  label: string;
  /** User must have at least one of these permissions to see the nav link. */
  permissions: readonly Permission[];
}
