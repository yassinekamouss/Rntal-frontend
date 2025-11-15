import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { jwtInterceptorFn } from './core/interceptors/jwt.interceptor';
import { AuthService } from './core/services/auth.service';

function appInitFactory() {
  const auth = inject(AuthService);
  return () => auth.hydrateFromStorage();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideHttpClient(withInterceptors([jwtInterceptorFn])),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      multi: true
    }
  ]
};
