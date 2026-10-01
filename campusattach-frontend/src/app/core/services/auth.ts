import { HttpClient } from '@angular/common/http';
import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../../models/user.model';

interface AuthResponse {
  message: string;
  accessToken: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: 'STUDENT' | 'ORGANIZATION' | 'ADMIN';
    isActive: boolean;
  };
}

interface RegisterResponse {
  message: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    role: 'STUDENT' | 'ORGANIZATION' | 'ADMIN';
    isActive: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private readonly apiUrl = 'http://localhost:3000/api';
  private readonly tokenKey = 'campusattach_token';
  private readonly roleKey = 'campusattach_role';
  private readonly userKey = 'campusattach_user';

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  currentUser = signal<User | null>(this.getStoredUser());

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/login`,
      { email, password }
    );
  }

  register(
    fullName: string,
    email: string,
    password: string,
    role: UserRole
  ) {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/auth/register`,
      {
        fullName,
        email,
        password,
        role: role.toUpperCase()
      }
    );
  }

  saveSession(response: AuthResponse): void {
    const user = this.mapUser(response.user);

    localStorage.setItem(this.tokenKey, response.accessToken);
    localStorage.setItem(this.roleKey, user.role);
    localStorage.setItem(this.userKey, JSON.stringify(user));

    this.currentUser.set(user);
  }

  saveRegisteredUser(userData: RegisterResponse['user']): void {
    const user = this.mapUser(userData);

    localStorage.setItem(this.roleKey, user.role);
    localStorage.setItem(this.userKey, JSON.stringify(user));

    this.currentUser.set(user);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userKey);

    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getRole(): UserRole | null {
    return localStorage.getItem(this.roleKey) as UserRole | null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private mapUser(user: AuthResponse['user']): User {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role.toLowerCase() as UserRole,
      isActive: user.isActive
    };
  }

  private getStoredUser(): User | null {
    const storedUser = localStorage.getItem(this.userKey);

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      return null;
    }
  }
}