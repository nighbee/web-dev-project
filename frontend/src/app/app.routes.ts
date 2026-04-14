import { Routes } from '@angular/router';
import { LoginComponent, VideoListComponent, VideoDetailComponent } from './components';

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
  }
];
