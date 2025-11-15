import { TestBed } from '@angular/core/testing';
import { RoleGuard } from './role.guard';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

class AuthServiceMock {
  user: any = null;
  isAuthenticated() { return !!this.user; }
  hasAnyRole(roles: any[]) { return this.user && roles.includes(this.user.role); }
}

class RouterMock {
  navigatedTo: any[] | null = null;
  navigate(commands: any[]) { this.navigatedTo = commands; }
}

describe('RoleGuard', () => {
  let guard: typeof RoleGuard;
  let auth: AuthServiceMock;
  let router: RouterMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Router, useClass: RouterMock }
      ]
    });
    guard = RoleGuard;
    auth = TestBed.inject(AuthService) as unknown as AuthServiceMock;
    router = TestBed.inject(Router) as unknown as RouterMock;
  });

  function makeRoute(roles: any[]): ActivatedRouteSnapshot {
    const snap = { data: { roles } } as any as ActivatedRouteSnapshot;
    return snap;
  }

  it('should allow when user role matches', () => {
    auth.user = { role: 'ROLE_OWNER' };
    const result = guard(makeRoute(['ROLE_OWNER', 'ROLE_ADMIN']), { url: '/me/properties' } as any);
    expect(result).toBeTrue();
  });

  it('should navigate to access-denied when role does not match', () => {
    auth.user = { role: 'ROLE_TENANT' };
    const result = guard(makeRoute(['ROLE_OWNER']), { url: '/me/properties' } as any);
    expect(result).toBeFalse();
    expect(router.navigatedTo).toEqual(['/access-denied']);
  });
});
