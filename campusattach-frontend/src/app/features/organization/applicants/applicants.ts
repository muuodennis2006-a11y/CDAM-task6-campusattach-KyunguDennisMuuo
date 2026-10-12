
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';

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
  loading = false;
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

    this.http.get<any>(`${this.api}/opportunities/mine`).pipe(
      timeout({ first: 20000 }),
      map(response => this.rows(response)),
      switchMap(opportunities => {
        if (!opportunities.length) {
          return of({ applicants: [] as Applicant[], failed: false });
        }

        return forkJoin(
          opportunities.map(opportunity =>
            this.http.get<any>(
              `${this.api}/opportunities/${opportunity.id}/applications`
            ).pipe(
              timeout({ first: 20000 }),
              map(response => ({
                opportunity,
                applications: this.rows(response),
                failed: false
              })),
              catchError(() => of({
                opportunity,
                applications: [],
                failed: true
              }))
            )
          )
        ).pipe(
          map(results => {
            const applicants: Applicant[] = [];

            for (const result of results) {
              for (const application of result.applications) {
                const profile = application.studentProfile || {};
                const user = profile.user || {};

                const date = application.appliedDate || application.createdAt;

                applicants.push({
                  id: application.id,
                  studentName: user.fullName || 'Student',
                  opportunity: result.opportunity.title || 'Opportunity',
                  university: profile.university || '—',
                  course: profile.course || '—',
                  appliedDate: date
                    ? new Date(date).toLocaleDateString()
                    : '—',
                  status: this.mapStatus(application.status)
                });
              }
            }

            return {
              applicants,
              failed: results.some(result => result.failed)
            };
          })
        );
      }),
      catchError(error => {
        this.errorMessage =
          error?.name === 'TimeoutError'
            ? 'The server took too long to respond. Please try again.'
            : error?.error?.message ||
              'Could not load applicants. Please sign in again if your session has expired.';

        return of({ applicants: [] as Applicant[], failed: true });
      })
    ).subscribe(result => {
      this.applicants = result.applicants;

      if (result.failed && !this.errorMessage) {
        this.errorMessage =
          'Some applications could not be loaded. Please try again.';
      }

      this.loading = false;
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
        if (applicant) {
          applicant.status = status as ApplicantStatus;
        }
      },
      error: error => {
        alert(error?.error?.message || 'Could not update application status.');
      }
    });
  }
}