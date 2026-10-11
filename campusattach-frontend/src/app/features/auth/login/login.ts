import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { timeout } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth);
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  submitted = false;
  loading = false;
  errorMessage = '';
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.loginForm.invalid || this.loading) {
      return;
    }
    const { email, password } = this.loginForm.getRawValue();
    this.loading = true;
    this.auth.login(email, password).pipe(timeout({ first: 15000 })).subscribe({
      next: (response) => {
        this.auth.saveSession(response);
        const role = this.auth.getRole();
        if (role === 'organization') {
          this.router.navigate(['/organization/dashboard']);
        } else if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: (error) => {
        this.loading = false;
        const message = error?.error?.message;
        this.errorMessage = error?.name === 'TimeoutError'
          ? 'The server took too long to respond. Please try again.'
          : error?.status === 401
            ? 'Incorrect email or password. Please try again.'
            : (Array.isArray(message) ? message.join(' ') : message) ||
              'Unable to sign in. Please check your connection and try again.';
      }
    });
  }
}
