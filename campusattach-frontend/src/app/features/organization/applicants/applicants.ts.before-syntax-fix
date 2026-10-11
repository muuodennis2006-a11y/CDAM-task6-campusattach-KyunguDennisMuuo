import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
type ApplicantStatus='Pending'|'Shortlisted'|'Accepted'|'Rejected';
interface Applicant{id:number;studentName:string;opportunity:string;university:string;course:string;appliedDate:string;status:ApplicantStatus;}
@Component({selector:'app-applicants',standalone:true,imports:[RouterLink],templateUrl:'./applicants.html',styleUrl:'./applicants.css'})
export class Applicants implements OnInit {
 private http=inject(HttpClient);private api='https://campusattach-backend.onrender.com/api';applicants:Applicant[]=[];loading=true;errorMessage='';
 ngOnInit(){this.load();}
 load(){this.loading=true;this.http.get<any[]>(`${this.api}/opportunities/mine`).subscribe({next:opps=>{if(!opps?.length){this.applicants=[];this.loading=false;return;}let remaining=opps.length;const all:Applicant[]=[];for(const o of opps){this.http.get<any[]>(`${this.api}/opportunities/${o.id}/applications`).subscribe({next:apps=>{for(const a of apps||[]){const p=a.studentProfile||{};const u=p.user||{};all.push({id:a.id,studentName:u.fullName||'Student',opportunity:o.title||'Opportunity',university:p.university||'—',course:p.course||'—',appliedDate:a.appliedDate?new Date(a.appliedDate).toLocaleDateString():'',status:this.mapStatus(a.status)});}if(--remaining===0){this.applicants=all;this.loading=false;}},error:e=>{if(--remaining===0){this.applicants=all;this.errorMessage=e?.error?.message||'Some applications could not be loaded.';this.loading=false;}});}},error:e=>{this.errorMessage=e?.error?.message||'Could not load your opportunities and applicants.';this.loading=false;}});}
 private mapStatus(s:string):ApplicantStatus{return s==='SHORTLISTED'?'Shortlisted':s==='ACCEPTED'?'Accepted':s==='REJECTED'?'Rejected':'Pending';}
 updateStatus(id:number,status:string){const backend=status==='Shortlisted'?'SHORTLISTED':status==='Accepted'?'ACCEPTED':status==='Rejected'?'REJECTED':'PENDING';this.http.patch(`${this.api}/applications/${id}/status`,{status:backend}).subscribe({next:()=>{const a=this.applicants.find(x=>x.id===id);if(a)a.status=status as ApplicantStatus;},error:e=>alert(e?.error?.message||'Could not update application status.')});}
}
