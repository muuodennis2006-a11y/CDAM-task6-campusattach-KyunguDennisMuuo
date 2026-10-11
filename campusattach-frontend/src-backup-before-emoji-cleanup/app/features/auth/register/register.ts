import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { UserRole } from '../../../models/user.model';

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
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['student' as UserRole, Validators.required]
  });

  submitted = false;
  loading = false;
  errorMessage = '';

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid || this.loading) {
      return;
    }

    const formValue = this.registerForm.getRawValue();

    this.loading = true;

    this.auth.register(
      formValue.fullName.trim(),
      formValue.email.trim(),
      formValue.password,
      formValue.role
    ).subscribe({
      next: (response) => {
        // Stop the loading state immediately after a successful response.
        this.loading = false;

        console.log('Registration response:', response);

        try {
          if (!response?.user) {
            this.errorMessage =
              'Registration was successful, but the account details were not returned. Please sign in manually.';
            return;
          }

          this.auth.saveRegisteredUser(response.user);

          this.router.navigate(['/login']);
        } catch (error) {
          console.error('Registration success handling failed:', error);

          this.errorMessage =
            'Your account was created successfully. Please go to Sign In and log in with your new account.';
        }
      },

      error: (error) => {
        console.error('Registration request failed:', error);

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Registration failed. Please check your details and try again.';
      }
    });
  }
}