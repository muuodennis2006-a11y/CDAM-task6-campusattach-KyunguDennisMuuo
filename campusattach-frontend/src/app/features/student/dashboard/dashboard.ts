import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/services/auth';

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

  private apiUrl = 'http://localhost:3000/api';

  user = this.auth.currentUser;

  opportunityCount = 0;
  applicationCount = 0;
  shortlistedCount = 0;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {

    this.http.get<any>(
      `${this.apiUrl}/opportunities?status=OPEN&page=1&limit=10`
    ).subscribe({
      next: (response) => {
        console.log('Dashboard opportunities response:', response);

        this.opportunityCount =
          response?.pagination?.total ??
          response?.data?.length ??
          0;
      },

      error: (error) => {
        console.error('Failed to load opportunities:', error);
      }
    });

    this.http.get<any[]>(
      `${this.apiUrl}/applications/my`
    ).subscribe({
      next: (applications) => {
        console.log('Dashboard applications:', applications);

        this.applicationCount = applications.length;

        this.shortlistedCount = applications.filter(
          application =>
            application.status === 'SHORTLISTED'
        ).length;
      },

      error: (error) => {
        console.error('Failed to load applications:', error);
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}