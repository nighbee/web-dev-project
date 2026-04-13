from django.urls import path
from .views import (
    get_all_videos, get_video_detail, user_logout, UserLoginView, UserRegistrationView,
    FavoriteListView, FavoriteDetailView,
    NoteListCreateView, NoteDetailView
)

urlpatterns = [
    # Аутентификация
    path('auth/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/logout/', user_logout, name='logout'),

    # Видео
    path('videos/', get_all_videos, name='video-list'),
    path('videos/<int:pk>/', get_video_detail, name='video-detail'),

    # Избранное
    path('favorites/', FavoriteListView.as_view(), name='favorite-list'),
    path('favorites/<int:pk>/', FavoriteDetailView.as_view(), name='favorite-detail'),

    # Заметки
    path('notes/', NoteListCreateView.as_view(), name='note-list'),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
]
