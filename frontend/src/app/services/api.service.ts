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
    return this.http.get<IVideo[]>(`${this.API_URL}/videos/`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  getVideo(id: number): Observable<IVideo> {
    return this.http.get<IVideo>(`${this.API_URL}/videos/${id}/`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // Notes (full CRUD)
  getNotes(videoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/notes/?video_id=${videoId}`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  createNote(note: { video: number; content: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/notes/`, note).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  updateNote(id: number, content: string): Observable<any> {
    return this.http.put(`${this.API_URL}/notes/${id}/`, { content }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/notes/${id}/`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // Favorites
  getFavorites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/favorites/`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  addFavorite(videoId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/favorites/`, { video: videoId }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  removeFavorite(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/favorites/${id}/`).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'An unknown error occurred';
    console.error('API Error:', error);

    // Handle token expiration
    if (error.status === 401) {
      message = 'Your session has expired. Please login again.';
      localStorage.removeItem('token');
    }
    // Handle server error response with detail message
    else if (error.error?.detail) {
      message = error.error.detail;
    }
    // Handle messages array (newer format)
    else if (error.error?.messages && Array.isArray(error.error.messages)) {
      message = error.error.messages[0]?.message || message;
    }
    // Handle non_field_errors (Django form validation)
    else if (error.error?.non_field_errors && Array.isArray(error.error.non_field_errors)) {
      message = error.error.non_field_errors[0];
    }
    // Handle field-specific errors (username, password, etc.)
    else if (error.error?.username) {
      message = Array.isArray(error.error.username) ? error.error.username[0] : error.error.username;
    } else if (error.error?.password) {
      message = Array.isArray(error.error.password) ? error.error.password[0] : error.error.password;
    } else if (error.error?.email) {
      message = Array.isArray(error.error.email) ? error.error.email[0] : error.error.email;
    }
    // Handle network errors
    else if (error.status === 0) {
      message = 'Network error. Please check your connection and that the backend is running.';
    }
    // Handle other HTTP errors
    else if (error.status >= 500) {
      message = 'Server error. Please try again later.';
    } else if (error.status >= 400) {
      message = error.error?.error || 'Request failed. Please try again.';
    }

    return throwError(() => new Error(message));
  }
}
