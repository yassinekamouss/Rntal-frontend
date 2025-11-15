import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = route.data?.['roles'] as Array<'ROLE_TENANT'|'ROLE_OWNER'|'ROLE_ADMIN'> | undefined;
  if (!roles || roles.length === 0) return true;
  if (auth.isAuthenticated() && auth.hasAnyRole(roles)) return true;
  router.navigate(['/access-denied']);
  return false;
};

