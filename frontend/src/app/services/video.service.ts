import { Injectable, signal, computed } from '@angular/core';

export interface Video {
  id: number;
  title: string;
  youtube_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
allVideos = signal<Video[]>([]);
  private favoritesSignal = signal<Video[]>([]);

  favorites = computed(() => this.favoritesSignal());
  favoriteIds = computed(() => new Set(this.favoritesSignal().map(f => f.id)));

  isVideoFavorite(video: Video): boolean {
    return this.favoriteIds().has(video.id);
  }

  constructor() {}

  setAllVideos(videos: Video[]) {
    this.allVideos.set(videos);
  }

  getAllVideos() {
    return this.allVideos();
  }

  toggleFavorite(video: Video): void {
    const current = this.favoritesSignal();
    const exists = current.some(v => v.id === video.id);

    if (exists) {
      this.favoritesSignal.set(current.filter(v => v.id !== video.id));
    } else {
      this.favoritesSignal.set([...current, video]);
    }
  }
}