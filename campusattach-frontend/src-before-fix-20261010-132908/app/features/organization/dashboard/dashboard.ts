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
  private http = inject(HttpClient); private api='https://campusattach-backend.onrender.com/api';
  postedOpportunities=0; totalApplicants=0; shortlisted=0; pendingReviews=0; statsError='';
  private auth = inject(Auth);
  private router = inject(Router);

  user = this.auth.currentUser;
  ngOnInit(): void { this.http.get<any[]>(`${this.api}/opportunities/mine`).subscribe({next:opps=>{this.postedOpportunities=opps.length;const ids=opps.map(o=>o.id);if(!ids.length)return;let left=ids.length;for(const id of ids)this.http.get<any[]>(`${this.api}/opportunities/${id}/applications`).subscribe({next:apps=>{this.totalApplicants+=apps.length;this.shortlisted+=(apps||[]).filter(a=>a.status==='SHORTLISTED').length;this.pendingReviews+=(apps||[]).filter(a=>a.status==='PENDING').length;if(--left===0){}},error:e=>{this.statsError=e?.error?.message||'Unable to load application statistics.';left--;}});},error:e=>this.statsError=e?.error?.message||'Unable to load your organization dashboard.'}); }
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
