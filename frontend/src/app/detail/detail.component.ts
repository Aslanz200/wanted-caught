import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Criminal } from '../models';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  criminal: Criminal | null = null;
  error: string | null = null;
  isLoading = false;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.loadDetail();
  }

  loadDetail() {
    this.error = null;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Некорректный идентификатор записи.';
      return;
    }
    this.isLoading = true;
    this.api.getCriminalById(id).subscribe({
      next: criminal => {
        this.criminal = criminal;
        this.isLoading = false;
      },
      error: err => {
        this.error = err?.message || 'Не удалось загрузить данные дела.';
        this.isLoading = false;
      }
    });
  }

  back() {
    this.router.navigate(['/criminals']);
  }
}
