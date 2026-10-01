import { Component } from '@angular/core';
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
export class Opportunities {
  opportunities: PostedOpportunity[] = [
    {
      id: 1,
      title: 'Software Development Intern',
      type: 'Internship',
      location: 'Nairobi, Kenya',
      deadline: '2026-10-30',
      applicants: 14,
      status: 'Open'
    },
    {
      id: 2,
      title: 'QA Testing Attachment',
      type: 'Attachment',
      location: 'Nairobi, Kenya',
      deadline: '2026-11-15',
      applicants: 8,
      status: 'Open'
    },
    {
      id: 3,
      title: 'IT Support Intern',
      type: 'Internship',
      location: 'Thika, Kenya',
      deadline: '2026-09-28',
      applicants: 12,
      status: 'Closed'
    }
  ];

  deletedId: number | null = null;

  deleteOpportunity(id: number): void {
    const confirmed = confirm(
      'Are you sure you want to delete this opportunity?'
    );

    if (!confirmed) return;

    this.opportunities = this.opportunities.filter(
      opportunity => opportunity.id !== id
    );

    this.deletedId = id;

    setTimeout(() => {
      this.deletedId = null;
    }, 1500);
  }
}
