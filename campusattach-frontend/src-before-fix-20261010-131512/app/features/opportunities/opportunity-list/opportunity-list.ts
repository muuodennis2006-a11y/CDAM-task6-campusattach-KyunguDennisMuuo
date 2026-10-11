import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Opportunity {
  id: number;
  title: string;
  type: string;
  location: string;
  description: string;
  requirements?: string;
  deadline?: string;
  status?: string;
  postedDate?: string;

  organizationName?: string;

  organization?: {
    id: number;
    name: string;
    location?: string;
  };
}

interface OpportunityResponse {
  data: Opportunity[];
  pagination?: {
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

  private readonly apiUrl =
    'https://campusattach-backend.onrender.com/api';

  opportunities = signal<Opportunity[]>([]);
  loading = signal(true);
  errorMessage = signal('');

  searchTerm = signal('');
  selectedType = signal('ALL');
  selectedLocation = signal('ALL');

  currentPage = signal(1);
  totalPages = signal(1);

  filteredOpportunities = computed(() => {
    const opportunities = this.opportunities();
    const search = this.searchTerm().trim().toLowerCase();
    const type = this.selectedType();
    const location = this.selectedLocation();

    return opportunities.filter(opportunity => {

      const matchesSearch =
        !search ||
        opportunity.title.toLowerCase().includes(search) ||
        opportunity.description.toLowerCase().includes(search) ||
        opportunity.organization?.name
          ?.toLowerCase()
          .includes(search);

      const matchesType =
        type === 'ALL' ||
        opportunity.type === type;

      const matchesLocation =
        location === 'ALL' ||
        opportunity.location === location;

      return matchesSearch && matchesType && matchesLocation;
    });
  });

  paginatedOpportunities = computed(() => {
    const items = this.filteredOpportunities();
    const page = this.currentPage();

    const pageSize = 6;
    const start = (page - 1) * pageSize;

    return items.slice(start, start + pageSize);
  });

  locations = computed(() => {
    const locationSet = new Set(
      this.opportunities()
        .map(opportunity => opportunity.location)
        .filter(Boolean)
    );

    return Array.from(locationSet);
  });

  ngOnInit(): void {
    this.loadOpportunities();
  }

  loadOpportunities(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.http
      .get<OpportunityResponse>(
        `${this.apiUrl}/opportunities?status=OPEN&page=1&limit=50`
      )
      .subscribe({
        next: response => {
          console.log(
            'Browse opportunities response:',
            response
          );

          this.opportunities.set(
            (response?.data ?? []).map(opportunity => ({
              ...opportunity,
              organizationName:
                opportunity.organization?.name ?? 'Organization'
            }))
          );

          this.currentPage.set(1);

          const total = response?.data?.length ?? 0;
          const pageSize = 6;

          this.totalPages.set(
            Math.max(1, Math.ceil(total / pageSize))
          );

          this.loading.set(false);
        },

        error: error => {
          console.error(
            'Failed to load opportunities:',
            error
          );

          this.opportunities.set([]);
          this.loading.set(false);
          this.errorMessage.set(
            'Failed to load opportunities. Please try again.'
          );
        }
      });
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
    this.currentPage.set(1);
    this.updateTotalPages();
  }

  updateType(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedType.set(select.value);
    this.currentPage.set(1);
    this.updateTotalPages();
  }

  updateLocation(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.selectedLocation.set(select.value);
    this.currentPage.set(1);
    this.updateTotalPages();
  }

  updateTotalPages(): void {
    const total = this.filteredOpportunities().length;
    const pageSize = 6;

    this.totalPages.set(
      Math.max(1, Math.ceil(total / pageSize))
    );
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }
}