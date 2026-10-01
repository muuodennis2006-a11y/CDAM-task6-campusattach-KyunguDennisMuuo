import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Opportunity } from '../../../models/opportunity.model';

interface ApiOpportunity {
  id: number;
  title: string;
  type: 'ATTACHMENT' | 'INTERNSHIP';
  location: string;
  description: string;
  requirements?: string | null;
  deadline: string;
  status: 'OPEN' | 'CLOSED' | 'PENDING' | 'REJECTED';
  postedDate: string;
  organization?: {
    name: string;
  };
}

interface OpportunityResponse {
  data: ApiOpportunity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './opportunity-list.html',
  styleUrl: './opportunity-list.css'
})
export class OpportunityList {
  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api';

  searchTerm = signal('');
  selectedType = signal('All');
  selectedLocation = signal('All');

  currentPage = signal(1);
  pageSize = 10;

  opportunities: Opportunity[] = [];

  loading = signal(true);
  errorMessage = signal('');

  filteredOpportunities = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const type = this.selectedType();
    const location = this.selectedLocation();

    return this.opportunities.filter(opportunity => {
      const matchesSearch =
        !search ||
        opportunity.title.toLowerCase().includes(search) ||
        opportunity.organizationName.toLowerCase().includes(search) ||
        opportunity.description.toLowerCase().includes(search);

      const matchesType =
        type === 'All' || opportunity.type === type;

      const matchesLocation =
        location === 'All' || opportunity.location === location;

      return matchesSearch && matchesType && matchesLocation;
    });
  });

  paginatedOpportunities = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;

    return this.filteredOpportunities().slice(
      start,
      start + this.pageSize
    );
  });

  totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(
        this.filteredOpportunities().length / this.pageSize
      )
    )
  );

  constructor() {
    this.loadOpportunities();
  }

  loadOpportunities(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.http
      .get<OpportunityResponse>(
        `${this.apiUrl}/opportunities?limit=50`
      )
      .subscribe({
        next: response => {
          this.opportunities = response.data.map(
            opportunity => this.mapOpportunity(opportunity)
          );

          this.loading.set(false);
        },
        error: error => {
          console.error('Failed to load opportunities:', error);

          this.errorMessage.set(
            error?.error?.message ||
            'Unable to load opportunities.'
          );

          this.loading.set(false);
        }
      });
  }

  private mapOpportunity(
    opportunity: ApiOpportunity
  ): Opportunity {
    return {
      id: opportunity.id,
      title: opportunity.title,
      organizationName:
        opportunity.organization?.name || 'Unknown organization',
      type:
        opportunity.type === 'ATTACHMENT'
          ? 'Attachment'
          : 'Internship',
      location: opportunity.location,
      description: opportunity.description,
      requirements: opportunity.requirements
        ? opportunity.requirements
            .split(',')
            .map(item => item.trim())
            .filter(Boolean)
        : [],
      deadline: opportunity.deadline,
      status:
        opportunity.status === 'OPEN'
          ? 'Open'
          : 'Closed',
      postedDate: opportunity.postedDate
    };
  }

  updateSearch(event: Event): void {
    this.searchTerm.set(
      (event.target as HTMLInputElement).value
    );

    this.currentPage.set(1);
  }

  updateType(event: Event): void {
    this.selectedType.set(
      (event.target as HTMLSelectElement).value
    );

    this.currentPage.set(1);
  }

  updateLocation(event: Event): void {
    this.selectedLocation.set(
      (event.target as HTMLSelectElement).value
    );

    this.currentPage.set(1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }
}