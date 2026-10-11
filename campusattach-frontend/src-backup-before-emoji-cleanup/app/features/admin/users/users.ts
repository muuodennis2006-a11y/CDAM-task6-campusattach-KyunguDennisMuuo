import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type UserRole = 'Student' | 'Organization' | 'Admin';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  registeredDate: string;
  active: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {
  users: AdminUser[] = [
    {
      id: 1,
      name: 'Brian Mwangi',
      email: 'brian@example.com',
      role: 'Student',
      registeredDate: '2026-08-20',
      active: true
    },
    {
      id: 2,
      name: 'Mary Wanjiku',
      email: 'mary@example.com',
      role: 'Student',
      registeredDate: '2026-08-22',
      active: true
    },
    {
      id: 3,
      name: 'Tech Solutions Kenya',
      email: 'info@techsolutions.co.ke',
      role: 'Organization',
      registeredDate: '2026-08-15',
      active: true
    },
    {
      id: 4,
      name: 'Innovate Africa',
      email: 'contact@innovate.africa',
      role: 'Organization',
      registeredDate: '2026-08-18',
      active: false
    },
    {
      id: 5,
      name: 'David Kamau',
      email: 'david@example.com',
      role: 'Student',
      registeredDate: '2026-09-02',
      active: true
    },
    {
      id: 6,
      name: 'Kenya Digital Services',
      email: 'info@kds.example',
      role: 'Organization',
      registeredDate: '2026-09-05',
      active: true
    }
  ];

  searchTerm = '';

  get filteredUsers(): AdminUser[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.users;
    }

    return this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }

  toggleUser(user: AdminUser): void {
    user.active = !user.active;
  }
}