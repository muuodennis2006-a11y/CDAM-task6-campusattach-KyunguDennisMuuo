import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface PostedOpportunity {
  id: number;
  title: string;
  type: string;
  location: string;
  deadline: string;
  applicants: number;
  status: string;
}

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './opportunities.html',
  styleUrl: './opportunities.css'
})
export class Opportunities implements OnInit {
  private http = inject(HttpClient);
  private api = 'https://campusattach-backend.onrender.com/api';

  opportunities: PostedOpportunity[] = [];
  deletedId: number | null = null;
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<any[]>(`${this.api}/opportunities/mine`).subscribe({
      next: (rows) => {
        this.opportunities = (rows || []).map((item) => ({
          id: item.id,
          title: item.title,
          type: String(item.type || '').toLowerCase() === 'attachment'
            ? 'Attachment' : 'Internship',
          location: item.location || '',
          deadline: item.deadline ? String(item.deadline).slice(0, 10) : '',
          applicants: item._count?.applications ?? item.applicantCount ?? 0,
          status: item.status === 'OPEN' ? 'Open'
            : item.status === 'CLOSED' ? 'Closed'
            : item.status === 'REJECTED' ? 'Rejected' : 'Pending'
        }));
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Could not load your opportunities. Please sign in again.';
        this.loading = false;
      }
    });
  }

  deleteOpportunity(id: number): void {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;

    this.http.delete(`${this.api}/opportunities/${id}`).subscribe({
      next: () => {
        this.opportunities = this.opportunities.filter(item => item.id !== id);
        this.deletedId = id;
      },
      error: (error) => {
        alert(error?.error?.message || 'Could not delete opportunity.');
      }
    });
  }
}
