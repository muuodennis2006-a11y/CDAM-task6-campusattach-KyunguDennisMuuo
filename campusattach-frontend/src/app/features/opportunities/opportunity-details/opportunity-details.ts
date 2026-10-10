import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  HttpClient
} from '@angular/common/http';

import {
  DatePipe
} from '@angular/common';

@Component({
  selector: 'app-opportunity-details',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './opportunity-details.html',
  styleUrl: './opportunity-details.css'
})
export class OpportunityDetails {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  private readonly apiUrl =
    'https://campusattach-backend.onrender.com/api';

  applied = signal(false);
  loading = signal(true);
  applying = signal(false);

  errorMessage = signal('');

  opportunity = signal<any | null>(null);

  ngOnInit(): void {

    this.route.paramMap.subscribe(
      params => {

        const id = Number(
          params.get('id')
        );

        if (
          !id ||
          Number.isNaN(id)
        ) {

          this.loading.set(false);

          this.errorMessage.set(
            'Invalid opportunity ID.'
          );

          return;
        }

        this.loadOpportunity(id);
      }
    );
  }

  loadOpportunity(
    id: number
  ): void {

    this.loading.set(true);
    this.errorMessage.set('');
    this.opportunity.set(null);

    console.log(
      'Loading opportunity:',
      id
    );

    this.http
      .get<any>(
        `${this.apiUrl}/opportunities/${id}`
      )
      .subscribe({

        next: response => {

          console.log(
            'Opportunity details response:',
            response
          );

          const data =
            response?.data ||
            response;

          this.opportunity.set(data);

          if (!data?.id) {

            this.errorMessage.set(
              'Opportunity details were not found.'
            );
          }

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Failed to load opportunity:',
            error
          );

          this.errorMessage.set(
            error?.error?.message ||
            'Failed to load opportunity.'
          );

          this.loading.set(false);
        }
      });
  }

  apply(): void {

    const opportunity =
      this.opportunity();

    if (
      !opportunity ||
      this.applying()
    ) {
      return;
    }

    this.applying.set(true);
    this.errorMessage.set('');

    this.http
      .post(
        `${this.apiUrl}/opportunities/${opportunity.id}/applications`,
        {}
      )
      .subscribe({

        next: response => {

          console.log(
            'Application submitted:',
            response
          );

          this.applied.set(true);
          this.applying.set(false);
        },

        error: error => {

          console.error(
            'Application failed:',
            error
          );

          this.applying.set(false);

          if (
            error?.status === 409
          ) {

            this.applied.set(true);

            this.errorMessage.set(
              error?.error?.message ||
              'You have already applied for this opportunity.'
            );

          } else {

            this.errorMessage.set(
              error?.error?.message ||
              'Application could not be submitted.'
            );
          }
        }
      });
  }
}