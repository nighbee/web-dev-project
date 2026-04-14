import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IVideo } from '../../models';
import { ApiService, AuthService } from '../../services';

@Component({
  selector: 'app-video-detail',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.css'
})
export class VideoDetailComponent implements OnInit {
  video = signal<IVideo | null>(null);
  noteContent = '';
  isFavorite = signal(false);
  favoriteId = signal<number | null>(null);
  existingNoteId = signal<number | null>(null);
  error = signal('');
  success = signal(false);

  embedUrl = computed<SafeResourceUrl>(() => {
    const v = this.video();
    if (!v) return '';
    const url = `https://www.youtube.com/embed/${v.youtube_id}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  });

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public auth: AuthService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadVideo(id);
    if (this.auth.isLoggedIn()) {
      this.loadFavorites(id);
      this.loadNotes(id);
    }
  }

  loadVideo(id: number) {
    // Using dummy data — replace with API call when backend is ready
    const dummyVideos: Record<number, IVideo> = {
      1: { id: 1, title: 'GCD and LCM Made Easy', youtube_id: 'MRjeHY4jp6Q' },
      2: { id: 2, title: 'Addition and subtraction of rational numbers', youtube_id: 'v_lxItUWgbc' },
      3: { id: 3, title: 'Multiplication and division of rational numbers', youtube_id: 'nYe--f94k7A' },
      4: { id: 4, title: 'Applying operations to simple fractions', youtube_id: 'olN97lKhMAE' },
      5: { id: 5, title: 'Applying operations to periodic fractions', youtube_id: '3bpV1WxvjJQ' },
      6: { id: 6, title: 'Monomial and its standard form', youtube_id: 'SUCM4r0UB0U' },
      7: { id: 7, title: 'Factorization of a polynomial', youtube_id: 'jCFlPSNwWT0' },
      8: { id: 8, title: 'Short multiplication formulas', youtube_id: '1WNbLvO9rks' },
      9: { id: 9, title: 'Multiplication, division and powers of rational expressions', youtube_id: 'XPwRfz1Pz0s' },
      10: { id: 10, title: 'Addition and Subtraction of Rational Expressions', youtube_id: 'f1VeZaY5i_E' },
      11: { id: 11, title: 'Applying operations to expressions with integer and rational exponents', youtube_id: 'UPxR5Ye6pMw' },
      12: { id: 12, title: 'Rational exponent degree', youtube_id: '0nvYAoIvpbc' },
      13: { id: 13, title: 'Applying operations to arithmetic roots', youtube_id: 'ih2stfiLhpw' }
    };
    this.video.set(dummyVideos[id] || null);
    // TODO: this.api.getVideo(id).subscribe(v => this.video.set(v));
  }

  loadFavorites(videoId: number) {
    this.api.getFavorites().subscribe({
      next: (favs) => {
        const match = favs.find((f: any) => f.video === videoId);
        this.isFavorite.set(!!match);
        this.favoriteId.set(match?.id || null);
      }
    });
  }

  loadNotes(videoId: number) {
    this.api.getNotes(videoId).subscribe({
      next: (notes: any[]) => {
        if (notes.length > 0) {
          this.noteContent = notes[0].content;
          this.existingNoteId.set(notes[0].id);
        }
      }
    });
  }

  toggleFavorite() {
    if (!this.auth.isLoggedIn()) return;
    const videoId = this.video()!.id;

    if (this.isFavorite()) {
      const fid = this.favoriteId();
      if (fid) {
        this.api.removeFavorite(fid).subscribe(() => {
          this.isFavorite.set(false);
          this.favoriteId.set(null);
        });
      }
    } else {
      this.api.addFavorite(videoId).subscribe({
        next: (res: any) => {
          this.isFavorite.set(true);
          this.favoriteId.set(res.id);
        },
        error: () => {
          this.error.set('Failed to add favorite');
        }
      });
    }
  }

  saveNote() {
    if (!this.noteContent.trim()) return;
    this.error.set('');
    this.success.set(false);
    const videoId = this.video()!.id;

    if (this.existingNoteId()) {
      this.api.updateNote(this.existingNoteId()!, this.noteContent).subscribe({
        next: () => { this.success.set(true); },
        error: (err) => { this.error.set(err.message); }
      });
    } else {
      this.api.createNote({ video: videoId, content: this.noteContent }).subscribe({
        next: (res: any) => {
          this.existingNoteId.set(res.id);
          this.success.set(true);
        },
        error: (err) => { this.error.set(err.message); }
      });
    }
  }
}
