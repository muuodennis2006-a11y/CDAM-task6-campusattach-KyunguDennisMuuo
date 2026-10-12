import { Component, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { timeout } from 'rxjs/operators';

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
  private cdr = inject(ChangeDetectorRef);
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

    this.http.get<any>(`${this.api}/opportunities/mine`).pipe(timeout({ first: 15000 })).subscribe({
      next: (rows) => {
        const list = Array.isArray(rows) ? rows : (Array.isArray(rows?.data) ? rows.data : []);
        this.opportunities = list.map((item: any) => ({
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
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || (error?.name === 'TimeoutError' ? 'The server took too long to respond. Please refresh and try again.' : error?.status === 401 ? 'Your session has expired. Please sign in again.' : 'Could not load your opportunities. Please check your connection and try again.');
        this.loading = false;
        this.cdr.detectChanges();
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


