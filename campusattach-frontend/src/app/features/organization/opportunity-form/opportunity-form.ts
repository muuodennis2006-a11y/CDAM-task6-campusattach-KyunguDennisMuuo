import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './opportunity-form.html',
  styleUrl: './opportunity-form.css'
})
export class OpportunityForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  saved = false;

  opportunityForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    type: ['Attachment', Validators.required],
    location: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(20)]],
    requirements: ['', Validators.required],
    deadline: ['', Validators.required]
  });

  constructor() {
    const id = this.route.snapshot.queryParamMap.get('id');

    if (id) {
      this.isEditMode = true;

      this.opportunityForm.patchValue({
        title: 'Software Development Intern',
        type: 'Internship',
        location: 'Nairobi, Kenya',
        description:
          'Join our software development team and gain practical experience building modern web applications.',
        requirements:
          'Basic programming knowledge\nUnderstanding of HTML, CSS and JavaScript\nTeamwork and communication skills',
        deadline: '2026-10-30'
      });
    }
  }

  onSubmit(): void {
    if (this.opportunityForm.invalid) {
      this.opportunityForm.markAllAsTouched();
      return;
    }

    const opportunity = this.opportunityForm.getRawValue();

    const stored = JSON.parse(
      localStorage.getItem('campusattach_opportunities') || '[]'
    );

    if (this.isEditMode) {
      stored.push({
        ...opportunity,
        id: Date.now(),
        organizationName: 'Demo Organization'
      });
    } else {
      stored.push({
        ...opportunity,
        id: Date.now(),
        organizationName: 'Demo Organization'
      });
    }

    localStorage.setItem(
      'campusattach_opportunities',
      JSON.stringify(stored)
    );

    this.saved = true;

    setTimeout(() => {
      this.router.navigate(['/organization/opportunities']);
    }, 800);
  }
}
