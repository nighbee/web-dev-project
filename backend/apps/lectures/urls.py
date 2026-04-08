from django.urls import path
from .views import (
    get_all_videos, user_logout, UserLoginView,
    FavoriteListView, FavoriteDetailView,
    NoteListCreateView, NoteDetailView
)

urlpatterns = [
    # Аутентификация
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/logout/', user_logout, name='logout'),

    # Видео
    path('videos/', get_all_videos, name='video-list'),

    # Избранное
    path('favorites/', FavoriteListView.as_view(), name='favorite-list'),
    path('favorites/<int:pk>/', FavoriteDetailView.as_view(), name='favorite-detail'),

    # Заметки
    path('notes/', NoteListCreateView.as_view(), name='note-list'),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='note-detail'),
]
