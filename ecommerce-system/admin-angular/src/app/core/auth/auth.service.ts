import { computed, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import type { Role } from '../../shared/models/role.model';
import type { User } from '../../shared/models/user.model';

const STORAGE_KEY = 'ecommerce_admin_session';

interface PersistedSession {
  user: User;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);

  private readonly userSignal = signal<User | null>(null);
  private readonly tokenSignal = signal<string | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly role = computed(() => this.userSignal()?.role ?? null);

  constructor() {
    this.restoreSession();
  }

  /**
   * Mock sign-in. Replace with real API call when the backend exists.
   */
  login(credentials: { email: string; password: string; role: Role }): Observable<void> {
    return of(undefined).pipe(
      delay(180),
      tap(() => {
        const user: User = {
          id: crypto.randomUUID(),
          email: credentials.email.trim(),
          displayName: this.displayNameFromEmail(credentials.email),
          role: credentials.role,
        };
        const token = `mock.${user.id}.${user.role}.${Date.now()}`;
        this.persistSession(user, token);
      }),
    );
  }

  /**
   * Mock: change role without re-login (updates session storage).
   */
  switchRole(role: Role): void {
    const user = this.userSignal();
    if (!user) {
      return;
    }
    const next: User = { ...user, role };
    const token = this.tokenSignal() ?? `mock.${next.id}.${next.role}`;
    this.persistSession(next, token);
  }

  logout(): void {
    this.clearSession();
    void this.router.navigate(['/login']);
  }

  private displayNameFromEmail(email: string): string {
    const local = email.split('@')[0]?.trim() ?? 'User';
    return local.charAt(0).toUpperCase() + local.slice(1);
  }

  private persistSession(user: User, token: string): void {
    this.userSignal.set(user);
    this.tokenSignal.set(token);
    const payload: PersistedSession = { user, token };
    try {
      this.document.defaultView?.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota / private mode */
    }
  }

  private clearSession(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    try {
      this.document.defaultView?.sessionStorage?.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  private restoreSession(): void {
    try {
      const raw = this.document.defaultView?.sessionStorage?.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as PersistedSession;
      if (parsed?.user && parsed?.token) {
        this.userSignal.set(parsed.user);
        this.tokenSignal.set(parsed.token);
      }
    } catch {
      this.clearSession();
    }
  }
}
