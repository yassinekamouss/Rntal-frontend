import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login and store token in localStorage when remember=true', () => {
    service.setUseSession(false);

    service.login({ email: 'john@ex.com', password: 'secret' }).subscribe();
    const reqLogin = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    reqLogin.flush({ token: 't-123' });

    const reqMe = httpMock.expectOne(`${environment.apiBaseUrl}/auth/me`);
    reqMe.flush({ id: 1, firstname: 'John', lastname: 'Doe', email: 'john@ex.com', role: 'ROLE_TENANT' });

    expect(localStorage.getItem('auth_token')).toBe('t-123');
    expect(sessionStorage.getItem('auth_token')).toBeNull();
  });

  it('should login and store token in sessionStorage when remember=false', () => {
    service.setUseSession(true);

    service.login({ email: 'john@ex.com', password: 'secret' }).subscribe();
    const reqLogin = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    reqLogin.flush({ token: 't-456' });

    const reqMe = httpMock.expectOne(`${environment.apiBaseUrl}/auth/me`);
    reqMe.flush({ id: 1, firstname: 'John', lastname: 'Doe', email: 'john@ex.com', role: 'ROLE_TENANT' });

    expect(sessionStorage.getItem('auth_token')).toBe('t-456');
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});

