import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api/auth';

  token = signal<string | null>(this.getValidToken());
  isLoggedIn = signal<boolean>(!!this.getValidToken());

  private getValidToken(): string | null {
    const token = localStorage.getItem('token');
    // On app startup, validate token exists (actual expiry check done by backend)
    if (token) {
      return token;
    }
    // Clear any invalid token
    localStorage.removeItem('token');
    return null;
  }

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ access: string; refresh: string }>(`${this.API_URL}/login/`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.access);
        this.token.set(res.access);
        this.isLoggedIn.set(true);
      })
    );
  }

  register(username: string, password: string, email: string) {
    return this.http.post<{ access: string; refresh: string }>(`${this.API_URL}/register/`, { username, password, email }).pipe(
      tap(res => {
        localStorage.setItem('token', res.access);
        this.token.set(res.access);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout() {
    return this.http.post(`${this.API_URL}/logout/`, {}).pipe(
      tap(() => {
        localStorage.removeItem('token');
        this.token.set(null);
        this.isLoggedIn.set(false);
      })
    );
  }
}