import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register').then(m => m.Register)
  },

  // ------------------------------------------
  // STUDENT ROUTES
  // ------------------------------------------

  {
    path: 'student/dashboard',
    canActivate: [authGuard, roleGuard(['student'])],
    loadComponent: () =>
      import('./features/student/dashboard/dashboard').then(m => m.Dashboard)
  },

  {
    path: 'student/profile',
    canActivate: [authGuard, roleGuard(['student'])],
    loadComponent: () =>
      import('./features/student/profile/profile').then(m => m.Profile)
  },

  {
    path: 'student/applications',
    canActivate: [authGuard, roleGuard(['student'])],
    loadComponent: () =>
      import('./features/student/applications/applications').then(m => m.Applications)
  },

  // ------------------------------------------
  // OPPORTUNITY ROUTES
  // ------------------------------------------

  {
    path: 'opportunities',
    canActivate: [authGuard, roleGuard(['student'])],
    loadComponent: () =>
      import('./features/opportunities/opportunity-list/opportunity-list')
        .then(m => m.OpportunityList)
  },

  {
    path: 'opportunities/:id',
    canActivate: [authGuard, roleGuard(['student'])],
    loadComponent: () =>
      import('./features/opportunities/opportunity-details/opportunity-details')
        .then(m => m.OpportunityDetails)
  },

  // ------------------------------------------
  // ORGANIZATION ROUTES
  // ------------------------------------------

  {
    path: 'organization/dashboard',
    canActivate: [authGuard, roleGuard(['organization'])],
    loadComponent: () =>
      import('./features/organization/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'organization/opportunities',
    canActivate: [authGuard, roleGuard(['organization'])],
    loadComponent: () =>
      import('./features/organization/opportunities/opportunities')
        .then(m => m.Opportunities)
  },

  {
    path: 'organization/opportunities/new',
    canActivate: [authGuard, roleGuard(['organization'])],
    loadComponent: () =>
      import('./features/organization/opportunity-form/opportunity-form')
        .then(m => m.OpportunityForm)
  },

  {
    path: 'organization/applicants',
    canActivate: [authGuard, roleGuard(['organization'])],
    loadComponent: () =>
      import('./features/organization/applicants/applicants')
        .then(m => m.Applicants)
  },

  // ------------------------------------------
  // ADMIN ROUTES
  // ------------------------------------------

  {
    path: 'admin/dashboard',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () =>
      import('./features/admin/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'admin/users',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () =>
      import('./features/admin/users/users')
        .then(m => m.Users)
  },

  {
    path: 'admin/opportunities',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () =>
      import('./features/admin/opportunities/opportunities')
        .then(m => m.Opportunities)
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
