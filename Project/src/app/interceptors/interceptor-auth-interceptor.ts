import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Extract user object from sessionStorage
  const userString = sessionStorage.getItem('user');
  let token: string | null = null;
  if (userString) {
    try {
      const userObj = JSON.parse(userString);
      token = userObj.token;
    } catch (e) {
      console.warn('Failed to parse user from sessionStorage:', e);
    }
  }
  console.log('Attempting to intercept. Token found:', token);
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }
  return next(req);
};