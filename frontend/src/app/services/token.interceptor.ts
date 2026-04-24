import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService, private router: Router) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.auth.getToken();
        const request = token
            ? req.clone({ setHeaders: { Authorization: `Token ${token}` } })
            : req;

        return next.handle(request).pipe(
            catchError((error: unknown) => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    this.auth.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}