//import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { IVideo, INote, IFavorite } from '../../models';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, SafeUrlPipe],
  templateUrl: './video-detail.html',
  styleUrl: './video-detail.css'  
})
export class VideoDetailComponent implements OnInit {
  video: IVideo | null = null;
  notes: INote[] = [];
  favorites: IFavorite[] = [];
  noteContent = '';
  editingNote: INote | null = null;
  errorMessage = '';
  videoId!: number;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private api: ApiService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.videoId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getVideo(this.videoId).subscribe({
  next: (v) => { 
    console.log('Video loaded:', v);
    this.video = v; 
    this.cdr.detectChanges();
  },
  error: (err) => {
    console.log('Video error:', err);
    this.errorMessage = err.message;
  }
});
    if (this.auth.isLoggedIn()) {
      this.loadNotes();
      this.loadFavorites();
    }
  }

  loadNotes() {
    this.api.getNotes(this.videoId).subscribe({
      next: (data) => this.notes = data,
      error: (err) => this.errorMessage = err.message
    });
  }

loadFavorites() {
  this.api.getFavorites().subscribe({
    next: (data) => { 
      this.favorites = data;
      this.cdr.detectChanges();  
    },
    error: () => {}
  });
}

  get isFavorite() { return this.favorites.some(f => f.video === this.videoId); }
  get favoriteId() { return this.favorites.find(f => f.video === this.videoId)?.id; }

  toggleFavorite() {
    if (this.isFavorite && this.favoriteId) {
      this.api.removeFavorite(this.favoriteId).subscribe(() => this.loadFavorites());
    } else {
      this.api.addFavorite(this.videoId).subscribe(() => this.loadFavorites());
    }
  }

  saveNote() {
    if (!this.noteContent.trim()) return;
    if (this.editingNote) {
      this.api.updateNote(this.editingNote.id!, this.noteContent).subscribe({
        next: () => { this.noteContent = ''; this.editingNote = null; this.loadNotes(); },
        error: (err) => this.errorMessage = err.message
      });
    } else {
      this.api.createNote({ video: this.videoId, content: this.noteContent }).subscribe({
        next: () => { this.noteContent = ''; this.loadNotes(); },
        error: (err) => this.errorMessage = err.message
      });
    }
  }

  editNote(note: INote) { this.editingNote = note; this.noteContent = note.content; }
  deleteNote(id: number) { this.api.deleteNote(id).subscribe(() => this.loadNotes()); }
  cancelEdit() { this.editingNote = null; this.noteContent = ''; }
  goBack() { this.router.navigate(['/videos']); }
  get embedUrl() { return 'https://www.youtube.com/embed/' + this.video?.youtube_id; }
}
