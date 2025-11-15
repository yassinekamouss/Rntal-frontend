import { PropertyStatus, Role } from './models/dtos';

export const ROLES: Role[] = ['ROLE_TENANT','ROLE_OWNER','ROLE_ADMIN'];
export const PROPERTY_STATUSES: PropertyStatus[] = ['AVAILABLE','RENTED','PENDING_VALIDATION'];

export const ROLE_LABELS: Record<Role, string> = {
  ROLE_TENANT: 'Locataire',
  ROLE_OWNER: 'Propriétaire',
  ROLE_ADMIN: 'Admin'
};

export const STATUS_LABELS: Record<PropertyStatus, string> = {
  AVAILABLE: 'Disponible',
  RENTED: 'Loué',
  PENDING_VALIDATION: 'En validation'
};

