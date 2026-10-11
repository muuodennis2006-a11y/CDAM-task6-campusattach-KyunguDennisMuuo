import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
type ModerationStatus='Pending'|'Approved'|'Rejected';
interface ModerationOpportunity{id:number;title:string;organization:string;type:string;location:string;submittedDate:string;status:ModerationStatus;}
@Component({selector:'app-opportunities',standalone:true,imports:[RouterLink],templateUrl:'./opportunities.html',styleUrl:'./opportunities.css'})
export class Opportunities implements OnInit {
 private http=inject(HttpClient); private api='https://campusattach-backend.onrender.com/api';
 opportunities:ModerationOpportunity[]=[]; loading=true; errorMessage='';
 ngOnInit(){this.load();}
 load(){this.loading=true;this.http.get<any[]>(`${this.api}/admin/opportunities`).subscribe({next:rows=>{this.opportunities=(rows||[]).map(o=>({id:o.id,title:o.title,organization:o.organization?.name||'Organization',type:String(o.type||'').toLowerCase()==='attachment'?'Attachment':'Internship',location:o.location||o.organization?.location||'—',submittedDate:o.createdAt?new Date(o.createdAt).toLocaleDateString():'',status:o.status==='OPEN'?'Approved':o.status==='REJECTED'?'Rejected':o.status==='CLOSED'?'Rejected':'Pending'}));this.loading=false;},error:e=>{this.errorMessage=e?.error?.message||'Could not load opportunities. Make sure you are signed in as System Admin.';this.loading=false;}});}
 getCount(status:ModerationStatus){return this.opportunities.filter(o=>o.status===status).length;}
 updateStatus(opportunity:ModerationOpportunity,status:ModerationStatus){const backendStatus=status==='Approved'?'OPEN':status==='Rejected'?'REJECTED':'PENDING';this.http.patch<any>(`${this.api}/admin/opportunities/${opportunity.id}/status`,{status:backendStatus}).subscribe({next:r=>opportunity.status=r.status==='OPEN'?'Approved':r.status==='REJECTED'?'Rejected':'Pending',error:e=>alert(e?.error?.message||'Could not update opportunity status.')});}
}
