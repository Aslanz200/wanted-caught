import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginCredentials } from '../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginCredentials = { username: '', password: '' };
  errorMessage = '';
  loading = false;

  constructor(
      private authService: AuthService,
      private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login success:', response);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Ошибка входа. Проверьте данные.';
        this.loading = false;
      }
    });
  }
}