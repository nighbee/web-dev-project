import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip token injection for auth endpoints (login, register, logout)
  const isAuthRequest = req.url.includes('/auth/login') || 
                        req.url.includes('/auth/register') || 
                        req.url.includes('/auth/logout');
  
  if (isAuthRequest) {
    return next(req).pipe(
      catchError(error => {
        // If auth request fails with 401, clear token
        if (error.status === 401) {
          localStorage.removeItem('token');
        }
        return throwError(() => error);
      })
    );
  }

  // Add token to protected API endpoints only
  const token = localStorage.getItem('token');
  const router = inject(Router);

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    
    return next(cloned).pipe(
      catchError(error => {
        // Handle 401 Unauthorized - token expired or invalid
        if (error.status === 401) {
          localStorage.removeItem('token');
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};












// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { AuthService } from './auth.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const isAuthRequest = req.url.includes('/api/auth/login') || req.url.includes('/api/auth/register');
  
//   if (isAuthRequest) {
//     return next(req);
//   }

//   const auth = inject(AuthService);
//   const token = auth.token();

//   if (token) {
//     const cloned = req.clone({
//       setHeaders: { Authorization: `Token ${token}` }
//     });
//     return next(cloned);
//   }

//   return next(req);
// };