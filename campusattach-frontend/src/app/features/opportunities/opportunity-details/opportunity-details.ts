import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-opportunity-details',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './opportunity-details.html',
  styleUrl: './opportunity-details.css'
})
export class OpportunityDetails {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/api';

  applied = false;
  loading = true;
  applying = false;
  errorMessage = '';

  opportunity: any = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any>(`${this.apiUrl}/opportunities/${id}`)
      .subscribe({
        next: (data) => {
          this.opportunity = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load opportunity:', error);
          this.errorMessage = 'Failed to load opportunity.';
          this.loading = false;
        }
      });
  }

  apply(): void {
    if (!this.opportunity || this.applying) {
      return;
    }

    this.applying = true;
    this.errorMessage = '';

    this.http.post(
      `${this.apiUrl}/opportunities/${this.opportunity.id}/applications`,
      {}
    ).subscribe({
      next: () => {
        this.applied = true;
        this.applying = false;
      },
      error: (error) => {
        console.error('Application failed:', error);

        this.applying = false;

        if (error.status === 409) {
          this.applied = true;
          this.errorMessage = 'You have already applied for this opportunity.';
        } else {
          this.errorMessage =
            error.error?.message || 'Application could not be submitted.';
        }
      }
    });
  }
}