import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './applications.html',
  styleUrl: './applications.css'
})
export class Applications {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api';

  applications: any[] = [];
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {

    this.http.get<any[]>(`${this.apiUrl}/applications/my`)
      .subscribe({
        next: (data) => {
          console.log('My applications:', data);

          this.applications = data;
          this.loading = false;
        },

        error: (error) => {
          console.error('Failed to load applications:', error);

          this.errorMessage =
            error.error?.message || 'Failed to load your applications.';

          this.loading = false;
        }
      });
  }
}