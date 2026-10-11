import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
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
    this.auth.login(email, password).subscribe({
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
        this.errorMessage =
          error?.error?.message ||
          'Unable to sign in. Please check your email and password.';
      }
    });
  }
}
