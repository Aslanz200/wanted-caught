import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Criminal, FilterOptions } from '../models';

@Component({
  selector: 'app-criminals',
  templateUrl: './criminals.component.html',
  styleUrls: ['./criminals.component.css']
})
export class CriminalsComponent implements OnInit {
  criminals: Criminal[] = [];
  filters: FilterOptions = { countries: [], years: [], crimeTypes: [] };
  selected = {
    search: '',
    country: 'all',
    year: 'all',
    crimeType: 'all'
  };
  isLoading = false;
  error: string | null = null;
  stats = { total: 0, countries: 0, years: 0, crimeTypes: 0 };

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadFilters();
    this.loadCriminals();
  }

  loadFilters() {
  this.api.getCriminals({}).subscribe({
    next: criminals => {
      const nationalities = [...new Set(criminals.map(c => c.nationality).filter(n => n))];
      const crimeTypes = ['murder', 'fraud', 'theft', 'terrorism', 'cybercrime', 'drug_trafficking', 'kidnapping', 'other'];
      
      const yearSet = new Set<number>();
      criminals.forEach(c => {
        if (c.date_of_birth) {
          const year = new Date(c.date_of_birth).getFullYear();
          yearSet.add(year);
        }
      });
      const years = Array.from(yearSet).sort((a, b) => b - a);

      this.filters = {
        countries: nationalities.sort() as string[],
        years: years as number[],
        crimeTypes: crimeTypes
      };
      
      this.updateStats();
    },
    error: err => (this.error = err?.message || 'Не удалось загрузить фильтры.')
    });
  }

  loadCriminals() {
    this.error = null;
    this.isLoading = true;
    this.api.getCriminals(this.selected).subscribe({
      next: criminals => {
        this.criminals = criminals;
        this.isLoading = false;
        this.updateStats();
      },
      error: err => {
        this.error = err?.message || 'Не удалось загрузить список.';
        this.isLoading = false;
      }
    });
  }

  resetFilters() {
    this.selected = { search: '', country: 'all', year: 'all', crimeType: 'all' };
    this.loadCriminals();
  }

  openDetail(criminal: Criminal) {
    this.router.navigate(['/detail', criminal.id]);
  }

  updateStats() {
    this.stats = {
      total: this.criminals.length,
      countries: new Set(this.criminals.map(c => c.nationality).filter(c => c)).size,  
      years: new Set(this.criminals.map(c => {
        if (c.date_of_birth) {
          return new Date(c.date_of_birth).getFullYear();
        }
        return 0;
      }).filter(y => y > 0)).size,  
      crimeTypes: new Set(this.criminals.map(c => c.primary_crime).filter(c => c)).size 
    };
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'wanted': 'В розыске',
      'arrested': 'Арестован',
      'released': 'Освобожден'
    };
    return statusMap[status] || status;
  }

  getCrimeTypeText(crimeType: string): string {
    const crimeMap: { [key: string]: string } = {
      'murder': 'Убийство',
      'fraud': 'Мошенничество',
      'theft': 'Кража',
      'terrorism': 'Терроризм',
      'cybercrime': 'Киберпреступность',
      'drug_trafficking': 'Наркоторговля',
      'kidnapping': 'Похищение',
      'other': 'Другое'
    };
    return crimeMap[crimeType] || crimeType;
  }

  getCountryName(countryCode: string): string {
    const countryMap: { [key: string]: string } = {
      'USA': 'США',
      'Mexico': 'Мексика',
      'Norway': 'Норвегия',
      'Uganda': 'Уганда',
      'Russia': 'Россия',
      'Italy': 'Италия',
      'Japan': 'Япония',
      'China': 'Китай',
      'Germany': 'Германия',
      'France': 'Франция',
      'UK': 'Великобритания',
      'Colombia': 'Колумбия',
      'Brazil': 'Бразилия'
    };
    return countryMap[countryCode] || countryCode;
  }

  applyFilters() {
    this.loadCriminals();
  }

  clearSearch() {
    this.selected.search = '';
    this.loadCriminals();
  }

  onImageError(event: any) {
    event.target.src = 'assets/default-avatar.png';
  }
}