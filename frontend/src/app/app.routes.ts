import { Routes } from '@angular/router';
import { VideoListComponent } from './components';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'videos',
    loadComponent: () => import('./components/video-list/video-list').then(m => m.VideoListComponent)
  },
  {
    path: 'videos/:id',
    loadComponent: () => import('./components/video-detail/video-detail').then(m => m.VideoDetailComponent)
  },
  {
    path: 'videos/:videoId/quiz',
    loadComponent: () => import('./components/quiz/quiz').then(m => m.QuizComponent)
  },
  {
    path: 'leaderboard',
    loadComponent: () => import('./components/leaderboard/leaderboard').then(m => m.LeaderboardComponent)
  }
];
