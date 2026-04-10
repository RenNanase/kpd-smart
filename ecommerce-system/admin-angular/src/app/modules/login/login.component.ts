import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { ROLES, type Role } from '../../shared/models/role.model';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly roles = ROLES;
  protected readonly signingIn = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['admin@example.com', [Validators.required, Validators.email]],
    password: ['password', Validators.required],
    role: this.fb.nonNullable.control<Role>('admin', Validators.required),
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.signingIn.set(true);
    this.auth
      .login({ email: v.email, password: v.password, role: v.role })
      .pipe(finalize(() => this.signingIn.set(false)))
      .subscribe({
        next: () => {
          const raw = this.route.snapshot.queryParamMap.get('returnUrl');
          const target =
            raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
          void this.router.navigateByUrl(target);
        },
      });
  }
}
