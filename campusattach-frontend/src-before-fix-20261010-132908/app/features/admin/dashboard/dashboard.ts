import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private api = 'https://campusattach-backend.onrender.com/api';
  totalUsers = 0; students = 0; organizations = 0; opportunities = 0; pendingOpportunities = 0; activeUsers = 0; inactiveUsers = 0; applications = 0; statsError = '';
  private auth = inject(Auth);
  private router = inject(Router);

  user = this.auth.currentUser;
  ngOnInit(): void { this.loadStats(); }
  loadStats(): void {
    this.http.get<any>(`${this.api}/admin/stats`).subscribe({next:s=>{this.totalUsers=s.totalUsers??0;this.students=s.students??0;this.organizations=s.organizations??0;this.opportunities=s.opportunities??0;this.pendingOpportunities=s.pendingOpportunities??0;this.activeUsers=s.activeUsers??0;this.inactiveUsers=s.inactiveUsers??0;this.applications=s.applications??0;},error:e=>this.statsError=e?.error?.message||'Unable to load dashboard statistics.'});
    this.http.get<any[]>(`${this.api}/admin/users`).subscribe({next: users => { this.totalUsers=users.length; this.students=users.filter(u=>u.role==='STUDENT').length; this.organizations=users.filter(u=>u.role==='ORGANIZATION').length; this.activeUsers=users.filter(u=>u.isActive).length; this.inactiveUsers=users.filter(u=>!u.isActive).length; },error:e=>this.statsError=e?.error?.message||'Unable to load user statistics.'});
    this.http.get<any[]>(`${this.api}/admin/opportunities`).subscribe({next: rows => { this.opportunities=rows.length; this.pendingOpportunities=rows.filter(o=>o.status==='PENDING').length; },error:e=>this.statsError=e?.error?.message||'Unable to load opportunity statistics.'});
  }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
