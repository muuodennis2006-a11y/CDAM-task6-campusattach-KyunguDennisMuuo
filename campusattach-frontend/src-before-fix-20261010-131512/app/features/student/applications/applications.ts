import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class Applications {

  private http = inject(HttpClient);

  private readonly apiUrl =
    'https://campusattach-backend.onrender.com/api';

  applications: any[] = [];

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http
      .get<any[]>(
        `${this.apiUrl}/applications/my`
      )
      .subscribe({
        next: data => {
          console.log('My applications from database:', data);

          this.applications = data || [];
          this.loading = false;
        },

        error: error => {
          console.error(
            'Failed to load applications:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to load your applications.';

          this.loading = false;
        }
      });
  }

  getOpportunityTitle(application: any): string {
    return (
      application?.opportunity?.title ||
      'Opportunity'
    );
  }

  getOrganizationName(application: any): string {
    return (
      application?.opportunity?.organization?.name ||
      'Organization'
    );
  }

  getStatusLabel(status: string): string {
    return String(status || '')
      .toLowerCase()
      .replace(/^\w/, letter => letter.toUpperCase());
  }
}