import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  HttpClient
} from '@angular/common/http';

import {
  RouterLink
} from '@angular/router';

import {
  Auth
} from '../../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private auth = inject(Auth);

  private readonly apiUrl =
    'https://campusattach-backend.onrender.com/api';

  loading = signal(true);
  saving = signal(false);

  submitted = signal(false);
  saved = signal(false);

  errorMessage = signal('');

  profileForm =
    this.fb.nonNullable.group({

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

      university: [
        '',
        Validators.required
      ],

      course: [
        '',
        Validators.required
      ],

      yearOfStudy: [
        0,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(6)
        ]
      ],

      phone: [
        '',
        Validators.required
      ],

      skills: [
        ''
      ],

      bio: [
        ''
      ]
    });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {

    this.loading.set(true);
    this.errorMessage.set('');

    this.http
      .get<any>(
        `${this.apiUrl}/students/profile`
      )
      .subscribe({

        next: profile => {

          console.log(
            'Student profile from database:',
            profile
          );

          const user =
            profile?.user;

          this.profileForm.patchValue({

            fullName:
              user?.fullName ||
              this.auth.currentUser()?.fullName ||
              '',

            email:
              user?.email ||
              this.auth.currentUser()?.email ||
              '',

            university:
              profile?.university ||
              '',

            course:
              profile?.course ||
              '',

            yearOfStudy:
              profile?.yearOfStudy ||
              0,

            phone:
              profile?.phone ||
              '',

            skills:
              profile?.skills ||
              '',

            bio:
              profile?.bio ||
              ''
          });

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Failed to load student profile:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Failed to load your profile.'
          );

          this.loading.set(false);
        }
      });
  }

  onSubmit(): void {

    this.submitted.set(true);
    this.saved.set(false);
    this.errorMessage.set('');

    if (
      this.profileForm.invalid ||
      this.saving()
    ) {
      return;
    }

    const formValue =
      this.profileForm.getRawValue();

    const profileData = {

      university:
        formValue.university.trim(),

      course:
        formValue.course.trim(),

      yearOfStudy:
        Number(formValue.yearOfStudy),

      phone:
        formValue.phone.trim(),

      skills:
        formValue.skills.trim(),

      bio:
        formValue.bio.trim()
    };

    this.saving.set(true);

    this.http
      .patch(
        `${this.apiUrl}/students/profile`,
        profileData
      )
      .subscribe({

        next: response => {

          console.log(
            'Student profile saved:',
            response
          );

          this.saving.set(false);
          this.saved.set(true);
        },

        error: error => {

          console.error(
            'Failed to save student profile:',
            error
          );

          this.saving.set(false);

          this.errorMessage.set(
            error?.error?.message ||
            'Failed to save your profile.'
          );
        }
      });
  }
}