import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ILeaderboardEntry } from '../../models';

interface Achievement {
  name: string;
  description: string;
  threshold: number;
  icon: string;
  achieved: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  currentUserProfile: any = null;
  leaderboard: ILeaderboardEntry[] = [];
  currentUserRank: number | null = null;
  loading = true;
  error = '';

  achievements: Achievement[] = [
    {
      name: 'Just Started',
      description: 'Earn 10 points by completing quizzes',
      threshold: 10,
      icon: '🌱',
      achieved: false
    },
    {
      name: 'Proficient Mathematician',
      description: 'Earn 20 points by completing quizzes',
      threshold: 20,
      icon: '🧠',
      achieved: false
    },
    {
      name: 'Dragon Warrior of Math',
      description: 'Earn 30 points by completing quizzes',
      threshold: 30,
      icon: '🐉',
      achieved: false
    }
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.api.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.currentUserProfile = profile;
        this.updateAchievements();
        this.loadLeaderboard();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.message || 'Failed to load profile';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadLeaderboard() {
    this.api.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data || [];
        if (this.currentUserProfile) {
          const entry = this.leaderboard.find(e => e.username === this.currentUserProfile.user.username);
          this.currentUserRank = entry ? entry.rank : null;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.message || 'Failed to load leaderboard';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateAchievements() {
    const points = this.currentUserProfile?.points || 0;
    this.achievements.forEach(a => {
      a.achieved = points >= a.threshold;
    });
  }

  get surroundingUsers(): ILeaderboardEntry[] {
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

  goBack() {
    this.router.navigate(['/videos']);
  }
}
