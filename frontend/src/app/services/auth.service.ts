import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { LoginCredentials, AuthResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authUrl = 'http://localhost:8000/api/auth';
  private readonly tokenKey = 'wantedCaughtToken';

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login/`, credentials).pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('token', response.token);
        }),
        catchError(error => {
          const message = (error as any)?.error?.error || 'Ошибка входа. Проверьте данные и повторите попытку.';
          return throwError(() => ({ message }));
        })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}