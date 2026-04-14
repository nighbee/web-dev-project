import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services';

@Component({
  selector: 'app-video-list',
  imports: [FormsModule, CommonModule],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.css'
})
export class VideoListComponent {
  searchBar = signal('');

  videos = signal([
    { id: 1, title: 'GCD and LCM Made Easy', youtube_id: 'MRjeHY4jp6Q' },
    { id: 2, title: 'Addition and subtraction of rational numbers', youtube_id: 'v_lxItUWgbc' },
    { id: 3, title: 'Multiplication and division of rational numbers', youtube_id: 'nYe--f94k7A' },
    { id: 4, title: 'Applying operations to simple fractions', youtube_id: 'olN97lKhMAE' },
    { id: 5, title: 'Applying operations to periodic fractions', youtube_id: '3bpV1WxvjJQ' },
    { id: 6, title: 'Monomial and its standard form', youtube_id: 'SUCM4r0UB0U' },
    { id: 7, title: 'Factorization of a polynomial', youtube_id: 'jCFlPSNwWT0' },
    { id: 8, title: 'Short multiplication formulas', youtube_id: '1WNbLvO9rks' },
    { id: 9, title: 'Multiplication, division and powers of rational expressions', youtube_id: 'XPwRfz1Pz0s' },
    { id: 10, title: 'Addition and Subtraction of Rational Expressions', youtube_id: 'f1VeZaY5i_E' },
    { id: 11, title: 'Applying operations to expressions with integer and rational exponents', youtube_id: 'UPxR5Ye6pMw' },
    { id: 12, title: 'Rational exponent degree', youtube_id: '0nvYAoIvpbc' },
    { id: 13, title: 'Applying operations to arithmetic roots', youtube_id: 'ih2stfiLhpw' }
  ]);

  filteredVideos = computed(() => {
    const q = this.searchBar().toLowerCase();
    return this.videos().filter(v => v.title.toLowerCase().includes(q));
  });

  constructor(private api: ApiService, private router: Router) {}

  navigate(id: number) {
    this.router.navigate(['/videos', id]);
  }
}
