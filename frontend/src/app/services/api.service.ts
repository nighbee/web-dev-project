import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IVideo } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly API_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Videos
  getVideos(): Observable<IVideo[]> {
    return this.http.get<IVideo[]>(`${this.API_URL}/videos/`).pipe(catchError(this.handleError));
  }

  getVideo(id: number): Observable<IVideo> {
    return this.http.get<IVideo>(`${this.API_URL}/videos/${id}/`).pipe(catchError(this.handleError));
  }

  // Notes (full CRUD)
  getNotes(videoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/notes/?video_id=${videoId}`).pipe(catchError(this.handleError));
  }

  createNote(note: { video: number; content: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/notes/`, note).pipe(catchError(this.handleError));
  }

  updateNote(id: number, content: string): Observable<any> {
    return this.http.put(`${this.API_URL}/notes/${id}/`, { content }).pipe(catchError(this.handleError));
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/notes/${id}/`).pipe(catchError(this.handleError));
  }

  // Favorites
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/favorites/`).pipe(catchError(this.handleError));
  }

  addFavorite(videoId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/favorites/`, { video: videoId }).pipe(catchError(this.handleError));
  }

  removeFavorite(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/favorites/${id}/`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'An unknown error occurred';
    if (error.error?.non_field_errors) {
      message = error.error.non_field_errors[0];
    } else if (error.error?.detail) {
      message = error.error.detail;
    } else if (error.error?.username || error.error?.password) {
      message = error.error.username || error.error.password;
    }
    return throwError(() => new Error(message));
  }
}
