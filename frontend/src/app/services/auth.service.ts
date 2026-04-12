import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api/auth';

  token = signal<string | null>(localStorage.getItem('token'));
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.API_URL}/login/`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.token.set(res.token);
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
