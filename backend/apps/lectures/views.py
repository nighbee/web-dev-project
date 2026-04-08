from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from .models import Video, Note, Favorite
from .serializers import (
    VideoBasicSerializer, NoteSerializer, 
    FavoriteSerializer, userLoginSerializer
)

# --- Function Based Views ---

@api_view(['GET'])
def get_all_videos(request):
    videos = Video.objects.all()
    serializer = VideoBasicSerializer(videos, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def user_logout(request): 
    return Response({'message': "logged out"}, status=200)

# --- Auth Modules ---

class UserLoginView(generics.GenericAPIView): 
    serializer_class = userLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request): 
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(username=serializer.validated_data['username'])
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh), 
            'access': str(refresh.access_token)
        })

# --- Favorite Views ---

class FavoriteListView(generics.ListCreateAPIView): 
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        # Используем твой кастомный менеджер!
        return Favorite.objects.get_user_favorites(self.request.user)

    def perform_create(self, serializer): 
        serializer.save(user=self.request.user)

class FavoriteDetailView(generics.RetrieveUpdateDestroyAPIView): 
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        return Favorite.objects.filter(user=self.request.user)

# --- Note Views ---

class NoteListCreateView(generics.ListCreateAPIView): 
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        video_id = self.request.query_params.get('video_id')
        if not video_id: 
            return Note.objects.none()
        return Note.objects.filter(user=self.request.user, video_id=video_id) 

    def perform_create(self, serializer): 
        serializer.save(user=self.request.user)

class NoteDetailView(generics.RetrieveUpdateDestroyAPIView): 
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        return Note.objects.filter(user=self.request.user)
