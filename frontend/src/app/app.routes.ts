import { Routes } from '@angular/router';
import { LoginComponent, VideoListComponent, VideoDetailComponent } from './components';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'videos', component: VideoListComponent },
  { path: 'videos/:id', component: VideoDetailComponent },
  { path: '', redirectTo: '/videos', pathMatch: 'full' }
];
