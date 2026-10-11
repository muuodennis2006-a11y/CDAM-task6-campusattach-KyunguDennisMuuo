import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

type ModerationStatus = 'Pending' | 'Approved' | 'Rejected';

interface ModerationOpportunity {
  id: number;
  title: string;
  organization: string;
  type: string;
  location: string;
  submittedDate: string;
  status: ModerationStatus;
}

@Component({
  selector: 'app-opportunities',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './opportunities.html',
  styleUrl: './opportunities.css'
})
export class Opportunities {
  opportunities: ModerationOpportunity[] = [
    {
      id: 1,
      title: 'Software Development Intern',
      organization: 'Tech Solutions Kenya',
      type: 'Internship',
      location: 'Nairobi, Kenya',
      submittedDate: '2026-09-18',
      status: 'Pending'
    },
    {
      id: 2,
      title: 'QA Testing Attachment',
      organization: 'Innovate Africa',
      type: 'Attachment',
      location: 'Nairobi, Kenya',
      submittedDate: '2026-09-17',
      status: 'Pending'
    },
    {
      id: 3,
      title: 'IT Support Intern',
      organization: 'Kenya Digital Services',
      type: 'Internship',
      location: 'Thika, Kenya',
      submittedDate: '2026-09-15',
      status: 'Approved'
    },
    {
      id: 4,
      title: 'Junior Web Developer',
      organization: 'Digital Hub Kenya',
      type: 'Internship',
      location: 'Mombasa, Kenya',
      submittedDate: '2026-09-14',
      status: 'Rejected'
    },
    {
      id: 5,
      title: 'Data Analyst Attachment',
      organization: 'Africa Data Labs',
      type: 'Attachment',
      location: 'Nairobi, Kenya',
      submittedDate: '2026-09-13',
      status: 'Pending'
    }
  ];

  getCount(status: ModerationStatus): number {
    return this.opportunities.filter(
      opportunity => opportunity.status === status
    ).length;
  }

  updateStatus(
    opportunity: ModerationOpportunity,
    status: ModerationStatus
  ): void {
    opportunity.status = status;
  }
}