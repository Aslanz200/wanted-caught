import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Criminal, FilterOptions } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8000/api';
  private readonly mediaUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getFilters(): Observable<FilterOptions> {
    return this.http.get<FilterOptions>(`${this.baseUrl}/filters/`).pipe(
        catchError(error => this.handleError(error))
    );
  }

  getCriminals(filters: Partial<{ country: string; year: string; crimeType: string; search: string }>): Observable<Criminal[]> {
    let params = new HttpParams();

    if (filters.search && filters.search !== 'all') {
      params = params.set('search', filters.search);
    }
    if (filters.country && filters.country !== 'all') {
      params = params.set('nationality', filters.country);
    }
    if (filters.crimeType && filters.crimeType !== 'all') {
      params = params.set('crime_type', filters.crimeType);
    }

    return this.http.get<Criminal[]>(`${this.baseUrl}/criminals/`, { params }).pipe(
        map(items => items.map(item => this.transformToCriminal(item))),
        catchError(error => this.handleError(error))
    );
  }

  getCriminalById(id: number): Observable<Criminal> {
    return this.http.get<Criminal>(`${this.baseUrl}/criminals/${id}/`).pipe(
        map(item => this.transformToCriminal(item)),
        catchError(error => this.handleError(error))
    );
  }

  loadStatistics(): Observable<{ total: number; countries: number; years: number; crimeTypes: number }> {
    return this.getCriminals({}).pipe(
        map(items => ({
          total: items.length,
          countries: new Set(items.map(item => item.nationality).filter(c => c)).size,
          years: new Set(items.map(item => {
            if (item.date_of_birth) {
              return new Date(item.date_of_birth).getFullYear();
            }
            return 0;
          }).filter(y => y > 0)).size,
          crimeTypes: new Set(items.map(item => item.primary_crime).filter(c => c)).size
        })),
        catchError(error => this.handleError(error))
    );
  }

  private transformToCriminal(item: any): Criminal {
    if (item.photo && !item.photo.startsWith('http')) {
      item.photo = item.photo.startsWith('/') 
        ? `${this.mediaUrl}${item.photo}` 
        : `${this.mediaUrl}/${item.photo}`;
    }
    return item;
  }

  getPhotoUrl(photoPath: string | null): string | undefined {
    if (!photoPath) {
      return undefined;
    }
    if (photoPath.startsWith('http')) {
      return photoPath;
    }
    if (photoPath.startsWith('/')) {
      return `${this.mediaUrl}${photoPath}`;
    }
    return `${this.mediaUrl}/${photoPath}`;
  }

  private getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'wanted': 'В розыске',
      'arrested': 'Арестован',
      'released': 'Освобожден'
    };
    return statusMap[status] || status;
  }

  private getCrimeTypeText(crimeType: string): string {
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

  login(credentials: {username: string, password: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login/`, credentials).pipe(
        catchError(error => this.handleError(error))
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout/`, {}).pipe(
        catchError(error => this.handleError(error))
    );
  }

  register(userData: {username: string, password: string, email?: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register/`, userData).pipe(
        catchError(error => this.handleError(error))
    );
  }

  private handleError(error: unknown) {
    console.error('API Error:', error);
    const message = (error as any)?.error?.error || 'Сервер недоступен. Попробуйте позже.';
    return throwError(() => ({ message }));
  }
}