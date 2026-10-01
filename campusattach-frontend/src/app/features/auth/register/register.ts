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
  errorMessage = '';

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    const formValue = this.registerForm.getRawValue();

    this.auth.register(
      formValue.fullName,
      formValue.email,
      formValue.password,
      formValue.role
    ).subscribe({
      next: (response) => {
        this.auth.saveRegisteredUser(response.user);

        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message ||
          'Registration failed. Please try again.';
      }
    });
  }
}