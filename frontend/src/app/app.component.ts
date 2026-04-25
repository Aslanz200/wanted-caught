import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  isPlaying = false;
  showAgeWarning = false;

  constructor(
      public authService: AuthService,
      private router: Router
  ) {}

  ngOnInit() {
    // Проверяем, согласился ли пользователь на возрастное ограничение
    const ageConfirmed = localStorage.getItem('ageConfirmed');
    if (!ageConfirmed) {
      this.showAgeWarning = true;
    }
  }

  confirmAge(confirmed: boolean) {
    if (confirmed) {
      localStorage.setItem('ageConfirmed', 'true');
      this.showAgeWarning = false;
    } else {
      // Перенаправить на безопасную страницу или закрыть
      window.location.href = 'https://www.google.com';
    }
  }

  toggleAudio() {
    if (this.isPlaying) {
      this.audioPlayer.nativeElement.pause();
      this.isPlaying = false;
    } else {
      this.audioPlayer.nativeElement.play().catch(err => {
        console.log('Audio play error:', err);
      });
      this.isPlaying = true;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}