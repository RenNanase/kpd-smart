import type { Role } from './role.model';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
}
