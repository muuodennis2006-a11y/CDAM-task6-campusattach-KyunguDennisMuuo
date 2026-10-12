import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/services/auth';
import { forkJoin, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private api = 'https://campusattach-backend.onrender.com/api';
  private auth = inject(Auth);
  private router = inject(Router);

  postedOpportunities = 0;
  totalApplicants = 0;
  shortlisted = 0;
  pendingReviews = 0;
  statsError = '';
  user = this.auth.currentUser;

  private rows(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.applications)) return response.applications;
    if (Array.isArray(response?.items)) return response.items;
    return [];
  }

  ngOnInit(): void {
    this.http.get<any>(`${this.api}/opportunities/mine`)
      .pipe(timeout({ first: 15000 }))
      .subscribe({
        next: response => {
          const opportunities = this.rows(response);
          this.postedOpportunities = opportunities.length;

          if (!opportunities.length) return;

          forkJoin(
            opportunities.map(opportunity =>
              this.http.get<any>(
                `${this.api}/opportunities/${opportunity.id}/applications`
              ).pipe(
                timeout({ first: 15000 }),
                map(result => ({ applications: this.rows(result), failed: false })),
                catchError(() => of({ applications: [], failed: true }))
              )
            )
          ).subscribe(results => {
            this.totalApplicants = 0;
            this.shortlisted = 0;
            this.pendingReviews = 0;

            for (const result of results) {
              this.totalApplicants += result.applications.length;
              this.shortlisted += result.applications.filter(
                application => application.status === 'SHORTLISTED'
              ).length;
              this.pendingReviews += result.applications.filter(
                application => application.status === 'PENDING'
              ).length;
            }

            if (results.some(result => result.failed)) {
              this.statsError = 'Some application statistics could not be loaded. Refresh to try again.';
            }
          });
        },
        error: error => {
          this.statsError = error?.error?.message ||
            (error?.name === 'TimeoutError'
              ? 'The server took too long to respond. Refresh to try again.'
              : 'Unable to load your organization dashboard. Please sign in again if needed.');
        }
      });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
