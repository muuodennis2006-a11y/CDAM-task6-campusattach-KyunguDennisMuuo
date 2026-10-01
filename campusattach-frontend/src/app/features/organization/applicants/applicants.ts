import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type ApplicantStatus = 'Pending' | 'Shortlisted' | 'Accepted' | 'Rejected';

interface Applicant {
  id: number;
  studentName: string;
  opportunity: string;
  university: string;
  course: string;
  appliedDate: string;
  status: ApplicantStatus;
}

@Component({
  selector: 'app-applicants',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './applicants.html',
  styleUrl: './applicants.css'
})
export class Applicants {
  applicants: Applicant[] = [
    {
      id: 1,
      studentName: 'Brian Mwangi',
      opportunity: 'Software Development Intern',
      university: 'Chuka University',
      course: 'Computer Science',
      appliedDate: '2026-09-12',
      status: 'Pending'
    },
    {
      id: 2,
      studentName: 'Mary Wanjiku',
      opportunity: 'Software Development Intern',
      university: 'Kenyatta University',
      course: 'Information Technology',
      appliedDate: '2026-09-11',
      status: 'Shortlisted'
    },
    {
      id: 3,
      studentName: 'David Kamau',
      opportunity: 'QA Testing Attachment',
      university: 'Chuka University',
      course: 'Computer Science',
      appliedDate: '2026-09-10',
      status: 'Pending'
    },
    {
      id: 4,
      studentName: 'Faith Njeri',
      opportunity: 'QA Testing Attachment',
      university: 'Mount Kenya University',
      course: 'Software Engineering',
      appliedDate: '2026-09-08',
      status: 'Accepted'
    }
  ];

  updateStatus(id: number, status: string): void {
    const applicant = this.applicants.find(item => item.id === id);

    if (!applicant) return;

    applicant.status = status as ApplicantStatus;
  }
}
