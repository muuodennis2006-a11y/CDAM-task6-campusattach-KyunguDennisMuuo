import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
interface PostedOpportunity{id:number;title:string;type:string;location:string;deadline:string;applicants:number;status:string;}
@Component({selector:'app-opportunities',standalone:true,imports:[RouterLink],templateUrl:'./opportunities.html',styleUrl:'./opportunities.css'})
export class Opportunities implements OnInit {
 private http=inject(HttpClient); private api='https://campusattach-backend.onrender.com/api';
 opportunities:PostedOpportunity[]=[]; deletedId:number|null=null; loading=true; errorMessage='';
 ngOnInit(){this.load();}
 load(){this.loading=true;this.http.get<any[]>(`${this.api}/opportunities/mine`).subscribe({next:rows=>{this.opportunities=(rows||[]).map(o=>({id:o.id,title:o.title,type:String(o.type||'').toLowerCase()==='attachment'?'Attachment':'Internship',location:o.location||'',deadline:o.deadline?String(o.deadline).slice(0,10):'',applicants:o._count?.applications??o.applicantCount??0,status:o.status==='OPEN'?'Open':o.status==='CLOSED'?'Closed':o.status==='REJECTED'?'Rejected':'Pending'}));this.loading=false;},error:e=>{this.errorMessage=e?.error?.message||'Could not load your opportunities. Please sign in again.';this.loading=false;}});}
 deleteOpportunity(id:number){if(!confirm('Are you sure you want to delete this opportunity?'))return;this.http.delete(`${this.api}/opportunities/${id}`).subscribe({next:()=>{this.opportunities=this.opportunities.filter(o=>o.id!==id);this.deletedId=id;setTimeout(()=>this.deletedId=null,1500);},error:e=>alert(e?.error?.message||'Could not delete opportunity.')}});
}
