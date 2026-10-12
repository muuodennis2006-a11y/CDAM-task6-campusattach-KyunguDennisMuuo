import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, map, timeout } from 'rxjs/operators';

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

  private rows(value: any): any[] {
    if (Array.isArray(value)) return value;
    if (Array.isArray(value?.data)) return value.data;
    if (Array.isArray(value?.applications)) return value.applications;
    if (Array.isArray(value?.items)) return value.items;
    return [];
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(`${this.api}/opportunities/mine`).pipe(
      timeout({ first: 20000 }),
      map(response => this.rows(response)),
      map(opportunities => opportunities.map(opportunity => ({
        opportunity,
        request: this.http.get<any>(
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
      }))),
      map(items => items.map(item => item.request)),
      map(requests => requests.length ? forkJoin(requests) : of([])),
      // Flatten the observable returned above.
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: resultsOrObservable => {
        // The request group is subscribed separately below.
        if (Array.isArray(resultsOrObservable)) {
          this.renderResults(resultsOrObservable);
        } else {
          resultsOrObservable.subscribe({
            next: results => this.renderResults(results),
            error: () => {
              this.errorMessage = 'Could not load applications. Please refresh and try again.';
              this.loading = false;
            },
            complete: () => this.loading = false
          });
        }
      },
      error: error => {
        this.errorMessage = error?.error?.message ||
          'Could not load opportunities. Please sign in again if your session has expired.';
        this.loading = false;
      }
    });
  }

  private renderResults(results: any[]): void {
    this.applicants = results.flatMap(result =>
      result.applications.map((application: any): Applicant => {
        const profile = application.studentProfile || {};
        const user = profile.user || {};

        return {
          id: application.id,
          studentName: user.fullName || user.name || 'Student',
          opportunity: result.opportunity.title || 'Opportunity',
          university: profile.university || '—',
          course: profile.course || '—',
          appliedDate: (application.appliedDate || application.createdAt)
            ? new Date(application.appliedDate || application.createdAt).toLocaleDateString()
            : '',
          status: this.mapStatus(application.status)
        };
      })
    );

    if (results.some(result => result.failed)) {
      this.errorMessage = 'Some applications could not be loaded.';
    }
    this.loading = false;
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
