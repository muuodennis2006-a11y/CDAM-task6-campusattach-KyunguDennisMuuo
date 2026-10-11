import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { UserRole } from '../../../models/user.model';
import { timeout } from 'rxjs/operators';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(Auth);
  registerForm = this.fb.nonNullable.group({
    fullName: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],
    role: [
      'student' as UserRole,
      Validators.required
    ]
  });
  submitted = false;
  loading = false;
  errorMessage = '';
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (
      this.registerForm.invalid ||
      this.loading
    ) {
      return;
    }
    const formValue =
      this.registerForm.getRawValue();
    const role =
      formValue.role === 'organization'
        ? 'organization'
        : 'student';
    this.loading = true;
    this.auth.register(
      formValue.fullName,
      formValue.email,
      formValue.password,
      role
    ).pipe(timeout({ first: 15000 })).subscribe({
      next: (response) => {
        this.loading = false;
        /*
         * Registration creates the account.
         * Login creates the authenticated session.
         */
        this.auth.saveRegisteredUser(
          response.user
        );
        this.router.navigate(
          ['/login'],
          {
            queryParams: {
              registered: 'true'
            }
          }
        );
      },
      error: (error) => {
        console.error(
          'Registration error:',
          error
        );
        this.loading = false;
        const message =
          error?.error?.message;
        if (error?.status === 409 || String(message || '').toLowerCase().includes('already registered')) {
          this.errorMessage = 'Email already registered. Please sign in instead';
        } else if (error?.name === 'TimeoutError') {
          this.errorMessage = 'The server took too long to respond. Please try again.';
        } else if (Array.isArray(message)) {
          this.errorMessage = message.join(' ');
        } else if (typeof message === 'string') {
          this.errorMessage = message;
        } else {
          this.errorMessage =
            'Registration failed. Please check your details and try again.';
        }
      }
    });
  }
}
