import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services';
import { ILeaderboardEntry } from '../../models';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.html',
  styleUrls: ['./leaderboard.css']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  leaderboard: ILeaderboardEntry[] = [];
  loading = true;
  error = '';
  autoRefresh = true; // Auto-refresh every 30 seconds

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLeaderboard();

    // Auto-refresh leaderboard every 30 seconds
    if (this.autoRefresh) {
      interval(30000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.loadLeaderboard());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadLeaderboard(): void {
    this.error = '';
    
    this.apiService.getLeaderboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.leaderboard = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err.message || 'Ошибка загрузки leaderboard';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  getMedalIcon(rank: number): string {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '';
    }
  }

  getRankClass(rank: number): string {
    if (rank <= 3) {
      return `rank-${rank}`;
    }
    return '';
  }

  refreshManually(): void {
    this.loadLeaderboard();
  }
}
