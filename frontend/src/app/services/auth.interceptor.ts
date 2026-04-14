import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
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