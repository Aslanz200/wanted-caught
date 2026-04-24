import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;
  isPlaying = false;

  constructor(
      public authService: AuthService,
      private router: Router
  ) {}

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