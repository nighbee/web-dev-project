import { Routes } from '@angular/router';
import { LoginComponent, VideoListComponent } from './components';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'videos', component: VideoListComponent },
  { path: '', redirectTo: '/videos', pathMatch: 'full' }
];
