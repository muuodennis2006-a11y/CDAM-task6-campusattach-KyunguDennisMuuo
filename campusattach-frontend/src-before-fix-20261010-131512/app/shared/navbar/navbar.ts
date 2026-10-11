import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { UserRole } from '../../models/user.model';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  readonly auth = inject(Auth);
  private readonly router = inject(Router);
  get role(): UserRole | null {
    return this.auth.currentUser()?.role ?? null;
  }
  get userName(): string {
    return this.auth.currentUser()?.fullName ?? 'User';
  }
  get roleLabel(): string {
    const role = this.role;
    if (role === 'student') {
      return 'Student';
    }
    if (role === 'organization') {
      return 'Organization';
    }
    if (role === 'admin') {
      return 'Administrator';
    }
    return 'User';
  }
  logout(): void {
    this.auth.logout();
  }
}
