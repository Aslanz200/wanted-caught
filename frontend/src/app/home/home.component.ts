import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  stats = { total: 0, countries: 0, years: 0, crimeTypes: 0 };
  isLoading = false;
  error: string | null = null;

  constructor(private api: ApiService, private router: Router) {}

  navigateToDatabase() {
    this.router.navigate(['/criminals']);
  }

  loadStatistics() {
    this.error = null;
    this.isLoading = true;
    this.api.loadStatistics().subscribe({
      next: stats => {
        this.stats = stats;
        this.isLoading = false;
      },
      error: error => {
        this.error = error?.message || 'Не удалось получить статистику.';
        this.isLoading = false;
      }
    });
  }
}
