import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { IVideo, IFavorite } from '../../models';
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
  showLeaderboard: boolean = false;
  leaderboard: any[] = [];
  currentUserProfile: any = null;
  currentUserRank: number | null = null;
  errorMessage: string = '';
  loading: boolean = true;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.showFavs = false;
    this.loading = true;

    this.api.getVideos().subscribe({
      next: (data) => {
        this.videos = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = err.message || 'Failed to load videos';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.loadFavorites();
    this.loadCurrentUserProfile();
    this.loadLeaderboard();
  }

  loadLeaderboard() {
    this.api.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data || [];
        if (this.currentUserProfile) {
          const entry = this.leaderboard.find(e => e.username === this.currentUserProfile.user.username);
          this.currentUserRank = entry ? entry.rank : null;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load leaderboard', err);
      }
    });
  }

  get topThree(): any[] {
    return this.leaderboard.slice(0, 3);
  }

  get surroundingUsers(): any[] {
    if (!this.currentUserRank) return [];
    const idx = this.leaderboard.findIndex(e => e.rank === this.currentUserRank);
    if (idx === -1) return [];
    const start = Math.max(0, idx - 5);
    const end = Math.min(this.leaderboard.length, idx + 6);
    return this.leaderboard.slice(start, end);
  }

  isCurrentUserEntry(username: string): boolean {
    return this.currentUserProfile?.user?.username === username;
  }

  loadCurrentUserProfile() {
    this.api.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.currentUserProfile = profile;
        const entry = this.leaderboard.find(e => e.username === profile.user.username);
        this.currentUserRank = entry ? entry.rank : null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load profile', err);
      }
    });
  }

  get level(): number {
    if (!this.currentUserProfile) return 1;
    return (Math.floor(this.currentUserProfile.points / 100) % 10) + 1;
  }

  get progressPoints(): number {
    if (!this.currentUserProfile) return 0;
    return this.currentUserProfile.points % 100;
  }

  get progressPercent(): number {
    return this.progressPoints;
  }

  loadFavorites() {
    this.api.getFavorites().subscribe({
      next: (data) => {
        this.favorites = data || [];
        this.cdr.detectChanges();
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
