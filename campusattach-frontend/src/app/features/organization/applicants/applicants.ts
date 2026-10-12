import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

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

  private rows(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.applications)) return response.applications;
    if (Array.isArray(response?.items)) return response.items;
    return [];
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.applicants = [];

    this.http.get<any>(`${this.api}/opportunities/mine`)
      .pipe(timeout({ first: 15000 }))
      .subscribe({
        next: response => {
          const opportunities = this.rows(response);

          if (!opportunities.length) {
            this.loading = false;
            return;
          }

          forkJoin(
            opportunities.map(opportunity =>
              this.http.get<any>(
                `${this.api}/opportunities/${opportunity.id}/applications`
              ).pipe(
                timeout({ first: 15000 }),
                map(result => ({
                  opportunity,
                  applications: this.rows(result),
                  failed: false
                })),
                catchError(() => of({
                  opportunity,
                  applications: [],
                  failed: true
                }))
              )
            )
          ).subscribe(results => {
            const all: Applicant[] = [];

            for (const result of results) {
              for (const application of result.applications) {
                const profile = application.studentProfile || application.student?.studentProfile || {};
                const user = profile.user || application.student || {};

                all.push({
                  id: application.id,
                  studentName: user.fullName || user.name || profile.fullName || 'Student',
                  opportunity: result.opportunity.title || 'Opportunity',
                  university: profile.university || '—',
                  course: profile.course || '—',
                  appliedDate: application.appliedDate || application.createdAt
                    ? new Date(application.appliedDate || application.createdAt).toLocaleDateString()
                    : '',
                  status: this.mapStatus(application.status)
                });
              }
            }

            this.applicants = all;
            if (results.some(result => result.failed)) {
              this.errorMessage = 'Some applications could not be loaded. Please refresh to try again.';
            }
            this.loading = false;
          });
        },
        error: error => {
          this.errorMessage = error?.error?.message ||
            (error?.name === 'TimeoutError'
              ? 'The server took too long to respond. Please refresh and try again.'
              : 'Could not load opportunities. Please sign in again if your session has expired.');
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
    }).pipe(timeout({ first: 15000 })).subscribe({
      next: () => {
        const applicant = this.applicants.find(item => item.id === id);
        if (applicant) applicant.status = status as ApplicantStatus;
      },
      error: error => alert(error?.error?.message || 'Could not update application status.')
    });
  }
}
