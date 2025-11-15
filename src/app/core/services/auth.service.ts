import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthResponseDTO, LoginRequestDTO, RegisterRequestDTO, UserResponseDTO } from '../models/dtos';
import { Router } from '@angular/router';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserResponseDTO | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();
  private useSession = false;

  constructor(private http: HttpClient, private router: Router) {}

  setUseSession(use: boolean) { this.useSession = use; }

  get token(): string | null {
    // Priorité à sessionStorage
    const tSession = sessionStorage.getItem(TOKEN_KEY);
    if (tSession) return tSession;
    return localStorage.getItem(TOKEN_KEY);
  }

  set token(value: string | null) {
    if (value) {
      if (this.useSession) {
        sessionStorage.setItem(TOKEN_KEY, value);
        localStorage.removeItem(TOKEN_KEY);
      } else {
        localStorage.setItem(TOKEN_KEY, value);
        sessionStorage.removeItem(TOKEN_KEY);
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
    }
  }

  hydrateFromStorage(): Promise<void> {
    const t = this.token;
    if (!t) {
      this.currentUserSubject.next(null);
      return Promise.resolve();
    }
    return this.me().pipe(
      tap((user) => this.currentUserSubject.next(user)),
      catchError((err) => {
        console.error('Failed to hydrate user from token', err);
        this.logout(false);
        return of(null);
      })
    ).toPromise().then(() => {});
  }

  register(payload: RegisterRequestDTO): Observable<AuthResponseDTO> {
    // Par défaut on "remember" après inscription
    this.setUseSession(false);
    return this.http.post<AuthResponseDTO>(`${environment.apiBaseUrl}/auth/register`, payload).pipe(
      tap((res) => {
        this.token = res.token;
      }),
      tap(() => {
        this.me().subscribe({
          next: (u) => this.currentUserSubject.next(u),
          error: (e) => console.error('me() after register failed', e)
        });
      })
    );
  }

  login(payload: LoginRequestDTO): Observable<AuthResponseDTO> {
    return this.http.post<AuthResponseDTO>(`${environment.apiBaseUrl}/auth/login`, payload).pipe(
      tap((res) => {
        this.token = res.token;
      }),
      tap(() => {
        this.me().subscribe({
          next: (u) => this.currentUserSubject.next(u),
          error: (e) => console.error('me() after login failed', e)
        });
      })
    );
  }

  me(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${environment.apiBaseUrl}/auth/me`);
  }

  logout(redirect: boolean = true): void {
    this.token = null;
    this.currentUserSubject.next(null);
    if (redirect) this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  hasAnyRole(roles: Array<'ROLE_TENANT'|'ROLE_OWNER'|'ROLE_ADMIN'>): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    return roles.includes(user.role);
  }
}
