import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';

export const jwtInterceptorFn: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const notify = inject(NotificationService);

  const token = auth.token;
  let cloned = req;
  if (token) {
    cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout(false);
        router.navigate(['/login']);
      } else if (error.status === 403) {
        notify.error('Accès refusé');
        router.navigate(['/access-denied']);
      } else if (error.status === 400 || error.status === 404) {
        const msg = (error.error && error.error.message) ? error.error.message : 'Requête invalide';
        notify.warn(msg);
      } else if (error.status >= 500) {
        notify.error('Une erreur interne est survenue.');
        console.error(error);
      }
      return throwError(() => error);
    })
  );
};

