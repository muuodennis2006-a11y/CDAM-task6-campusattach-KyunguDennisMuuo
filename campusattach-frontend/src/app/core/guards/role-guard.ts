import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { UserRole } from '../../models/user.model';

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return () => {
    const auth = inject(Auth);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    const role = auth.getRole();

    if (role && allowedRoles.includes(role)) {
      return true;
    }

    if (role === 'student') {
      return router.createUrlTree(['/student/dashboard']);
    }

    if (role === 'organization') {
      return router.createUrlTree(['/organization/dashboard']);
    }

    if (role === 'admin') {
      return router.createUrlTree(['/admin/dashboard']);
    }

    return router.createUrlTree(['/login']);
  };
}
