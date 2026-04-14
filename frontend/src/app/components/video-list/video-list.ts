//import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { IVideo, IFavorite } from '../../models';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './video-list.html',
  styleUrl: './video-list.css'
})
  export class VideoListComponent implements OnInit {
  videos: IVideo[] = [];
  favorites: IFavorite[] = [];
  searchBar: string = '';
  showFavs: boolean = false;
  errorMessage: string = '';
  loading: boolean = true;        // ← обязательно должна быть

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.showFavs = false;   // явно показываем вкладку "All Videos"
    this.loading = true;

this.api.getVideos().subscribe({
  next: (data) => {
    this.videos = data || [];
    this.loading = false;
    this.cdr.detectChanges();        // ← это заставит Angular обновить экран
  },
  error: (err: any) => {
    console.error(err);
    this.errorMessage = err.message || 'Failed to load videos';
    this.loading = false;
    this.cdr.detectChanges();
  }
});

    // Загружаем избранное
    this.loadFavorites();
  }

  loadFavorites() {
    this.api.getFavorites().subscribe({
      next: (data) => {
        this.favorites = data || [];
      },
      error: (err) => {
        console.error('Failed to load favorites', err);
      }
    });
  }

  isFavorite(videoId: number): boolean {
    return this.favorites.some(f => f.video === videoId);
  }

  getFavoriteId(videoId: number): number | undefined {
    return this.favorites.find(f => f.video === videoId)?.id;
  }

  toggleFavorite(videoId: number) {
    if (this.isFavorite(videoId)) {
      const favId = this.getFavoriteId(videoId);
      if (favId) {
        this.favorites = this.favorites.filter(f => f.video !== videoId);
        this.api.removeFavorite(favId).subscribe({
          error: () => this.loadFavorites()
        });
      }
    } else {
      this.favorites = [...this.favorites, { video: videoId }];
      this.api.addFavorite(videoId).subscribe({
        next: (newFav: any) => {
          this.favorites = this.favorites.filter(f => f.video !== videoId);
          this.favorites = [...this.favorites, newFav];
        },
        error: () => {
          this.favorites = this.favorites.filter(f => f.video !== videoId);
          this.loadFavorites(); // перезагружаем на случай ошибки
        }
      });
    }
  }

  get filteredVideos(): IVideo[] {
    return this.videos.filter(v =>
      v.title.toLowerCase().includes(this.searchBar.toLowerCase())
    );
  }

  get favoriteVideos(): IVideo[] {
    const favIds = this.favorites.map(f => f.video);
    return this.videos.filter(v =>
      favIds.includes(v.id) &&
      v.title.toLowerCase().includes(this.searchBar.toLowerCase())
    );
  }

  get displayedVideos(): IVideo[] {
    return this.showFavs ? this.favoriteVideos : this.filteredVideos;
  }

  openVideo(id: number) {
    this.router.navigate(['/videos', id]);
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
