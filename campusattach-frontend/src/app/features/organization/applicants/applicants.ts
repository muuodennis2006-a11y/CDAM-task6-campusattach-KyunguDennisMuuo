import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
export class Applicants implements OnInit {
  private http = inject(HttpClient);
  private api = 'https://campusattach-backend.onrender.com/api';

  applicants: Applicant[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any[]>(`${this.api}/opportunities/mine`).subscribe({
      next: (opportunities) => {
        if (!opportunities?.length) {
          this.applicants = [];
          this.loading = false;
          return;
        }

        let remaining = opportunities.length;
        const all: Applicant[] = [];

        for (const opportunity of opportunities) {
          this.http.get<any[]>(
            `${this.api}/opportunities/${opportunity.id}/applications`
          ).subscribe({
            next: (applications) => {
              for (const application of applications || []) {
                const profile = application.studentProfile || {};
                const user = profile.user || {};

                all.push({
                  id: application.id,
                  studentName: user.fullName || 'Student',
                  opportunity: opportunity.title || 'Opportunity',
                  university: profile.university || '—',
                  course: profile.course || '—',
                  appliedDate: application.appliedDate
                    ? new Date(application.appliedDate).toLocaleDateString()
                    : '',
                  status: this.mapStatus(application.status)
                });
              }

              remaining--;
              if (remaining === 0) {
                this.applicants = all;
                this.loading = false;
              }
            },
            error: (error) => {
              this.errorMessage =
                error?.error?.message || 'Some applications could not be loaded.';
              remaining--;
              if (remaining === 0) {
                this.applicants = all;
                this.loading = false;
              }
            }
          });
        }
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Could not load opportunities and applicants.';
        this.loading = false;
      }
    });
  }

  private mapStatus(status: string): ApplicantStatus {
    if (status === 'SHORTLISTED') return 'Shortlisted';
    if (status === 'ACCEPTED') return 'Accepted';
    if (status === 'REJECTED') return 'Rejected';
    return 'Pending';
  }

  updateStatus(id: number, status: string): void {
    const backendStatus =
      status === 'Shortlisted' ? 'SHORTLISTED' :
      status === 'Accepted' ? 'ACCEPTED' :
      status === 'Rejected' ? 'REJECTED' : 'PENDING';

    this.http.patch(`${this.api}/applications/${id}/status`, {
      status: backendStatus
    }).subscribe({
      next: () => {
        const applicant = this.applicants.find(item => item.id === id);
        if (applicant) applicant.status = status as ApplicantStatus;
      },
      error: (error) => {
        alert(error?.error?.message || 'Could not update application status.');
      }
    });
  }
}
