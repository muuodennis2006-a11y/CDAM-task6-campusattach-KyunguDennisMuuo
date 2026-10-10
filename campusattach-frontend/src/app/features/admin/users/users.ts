import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

type UserRole = 'Student' | 'Organization' | 'Admin';
interface AdminUser { id:number; name:string; email:string; role:UserRole; registeredDate:string; active:boolean; }
@Component({selector:'app-users',standalone:true,imports:[FormsModule,RouterLink],templateUrl:'./users.html',styleUrl:'./users.css'})
export class Users implements OnInit {
 private http=inject(HttpClient); private api='https://campusattach-backend.onrender.com/api';
 users:AdminUser[]=[]; searchTerm=''; loading=true; errorMessage='';
 ngOnInit(){this.loadUsers();}
 loadUsers(){this.loading=true;this.errorMessage='';this.http.get<any[]>(`${this.api}/admin/users`).subscribe({next:rows=>{this.users=(rows||[]).map(u=>({id:u.id,name:u.fullName||'Unnamed user',email:u.email,role:u.role==='STUDENT'?'Student':u.role==='ORGANIZATION'?'Organization':'Admin',registeredDate:u.createdAt?new Date(u.createdAt).toLocaleDateString():'',active:!!u.isActive}));this.loading=false;},error:e=>{this.errorMessage=e?.error?.message||'Could not load users. Sign in with a System Admin account and try again.';this.loading=false;}});}
 get filteredUsers(){const t=this.searchTerm.trim().toLowerCase();return !t?this.users:this.users.filter(u=>u.name.toLowerCase().includes(t)||u.email.toLowerCase().includes(t)||u.role.toLowerCase().includes(t));}
 toggleUser(user:AdminUser){const next=!user.active;this.http.patch<any>(`${this.api}/admin/users/${user.id}/status`,{isActive:next}).subscribe({next:r=>user.active=!!r.isActive,error:e=>alert(e?.error?.message||'Could not update this account. Please try again.')});}
}
