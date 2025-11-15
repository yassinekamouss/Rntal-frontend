import { Routes } from '@angular/router';
import { UnauthGuard } from './core/guards/unauth.guard';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/properties/home.component').then(m => m.HomeComponent) },
  { path: 'properties/:id', loadComponent: () => import('./features/properties/property-detail.component').then(m => m.PropertyDetailComponent) },

  { path: 'login', canActivate: [UnauthGuard], loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [UnauthGuard], loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },

  { path: 'profile', canActivate: [AuthGuard], loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'me/rentals', canActivate: [AuthGuard, RoleGuard], data: { roles: ['ROLE_TENANT'] }, loadComponent: () => import('./features/rentals/my-rentals.component').then(m => m.MyRentalsComponent) },

  { path: 'me/properties', canActivate: [AuthGuard, RoleGuard], data: { roles: ['ROLE_OWNER','ROLE_ADMIN'] }, loadComponent: () => import('./features/properties/my-properties.component').then(m => m.MyPropertiesComponent) },
  { path: 'me/properties/new', canActivate: [AuthGuard, RoleGuard], data: { roles: ['ROLE_OWNER','ROLE_ADMIN'] }, loadComponent: () => import('./features/properties/property-form.component').then(m => m.PropertyFormComponent) },
  { path: 'me/properties/:id/edit', canActivate: [AuthGuard, RoleGuard], data: { roles: ['ROLE_OWNER','ROLE_ADMIN'] }, loadComponent: () => import('./features/properties/property-form.component').then(m => m.PropertyFormComponent) },
  { path: 'me/properties/:id/rentals', canActivate: [AuthGuard, RoleGuard], data: { roles: ['ROLE_OWNER','ROLE_ADMIN'] }, loadComponent: () => import('./features/rentals/property-rentals.component').then(m => m.PropertyRentalsComponent) },

  { path: 'access-denied', loadComponent: () => import('./shared/components/access-denied.component').then(m => m.AccessDeniedComponent) },
  { path: '**', loadComponent: () => import('./shared/components/not-found.component').then(m => m.NotFoundComponent) }
];
