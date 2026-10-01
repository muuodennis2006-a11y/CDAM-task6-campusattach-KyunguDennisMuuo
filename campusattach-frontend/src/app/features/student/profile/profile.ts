import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  private fb = inject(FormBuilder);

  submitted = false;
  saved = false;

  profileForm = this.fb.nonNullable.group({
    fullName: ['Demo Student', [Validators.required, Validators.minLength(3)]],
    email: ['student@campusattach.demo', [Validators.required, Validators.email]],
    university: ['Chuka University', Validators.required],
    course: ['Bachelor of Science in Computer Science', Validators.required],
    yearOfStudy: [3, [Validators.required, Validators.min(1), Validators.max(6)]],
    phone: ['0712345678', Validators.required],
    skills: ['Angular, TypeScript, HTML, CSS'],
    bio: [
      'Computer science student interested in software development, testing and technology.'
    ]
  });

  onSubmit(): void {
    this.submitted = true;
    this.saved = false;

    if (this.profileForm.invalid) {
      return;
    }

    this.saved = true;
  }
}