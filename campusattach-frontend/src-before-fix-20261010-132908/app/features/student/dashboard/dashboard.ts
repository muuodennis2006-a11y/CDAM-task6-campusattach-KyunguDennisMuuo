import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  HttpClient
} from '@angular/common/http';

import {
  Auth
} from '../../../core/services/auth';

interface OpportunityResponse {
  data: any[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  private auth = inject(Auth);
  private router = inject(Router);
  private http = inject(HttpClient);

  private readonly apiUrl =
    'https://campusattach-backend.onrender.com/api';

  user = this.auth.currentUser;

  opportunityCount = signal(0);
  applicationCount = signal(0);
  shortlistedCount = signal(0);

  loading = signal(true);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {

    this.loading.set(true);

    // Load all currently open opportunities.
    this.http
      .get<OpportunityResponse>(
        `${this.apiUrl}/opportunities?status=OPEN&page=1&limit=50`
      )
      .subscribe({

        next: response => {

          console.log(
            'Dashboard opportunities:',
            response
          );

          this.opportunityCount.set(
            response?.pagination?.total ??
            response?.data?.length ??
            0
          );
        },

        error: error => {

          console.error(
            'Failed to load dashboard opportunities:',
            error
          );

          this.opportunityCount.set(0);
        }
      });

    // Load this student's applications.
    this.http
      .get<any[]>(
        `${this.apiUrl}/applications/my`
      )
      .subscribe({

        next: applications => {

          console.log(
            'Dashboard student applications:',
            applications
          );

          const pending =
            applications.filter(
              application =>
                String(
                  application.status
                ).toUpperCase() ===
                'PENDING'
            ).length;

          const shortlisted =
            applications.filter(
              application =>
                String(
                  application.status
                ).toUpperCase() ===
                'SHORTLISTED'
            ).length;

          this.applicationCount.set(
            applications.length
          );

          this.shortlistedCount.set(
            shortlisted
          );

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Failed to load student applications:',
            error
          );

          this.applicationCount.set(0);
          this.shortlistedCount.set(0);
          this.loading.set(false);
        }
      });
  }

  logout(): void {

    this.auth.logout();

    this.router.navigate([
      '/login'
    ]);
  }
}