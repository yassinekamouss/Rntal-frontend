import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

class AuthServiceMock {
  authed = false;
  isAuthenticated() { return this.authed; }
}

class RouterMock {
  navigatedTo: any[] | null = null;
  navigate(commands: any[]) { this.navigatedTo = commands; }
}

describe('AuthGuard', () => {
  let guardFn: typeof AuthGuard;
  let auth: AuthServiceMock;
  let router: RouterMock;
  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = { url: '/test' } as RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: Router, useClass: RouterMock }
      ]
    });
    guardFn = AuthGuard;
    auth = TestBed.inject(AuthService) as unknown as AuthServiceMock;
    router = TestBed.inject(Router) as unknown as RouterMock;
  });

  it('should block and redirect to /login when not authenticated', () => {
    auth.authed = false;
    const result = guardFn(dummyRoute, dummyState);
    expect(result).toBeFalse();
    expect(router.navigatedTo).toEqual(['/login']);
  });

  it('should allow when authenticated', () => {
    auth.authed = true;
    const result = guardFn(dummyRoute, dummyState);
    expect(result).toBeTrue();
  });
});
