from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status, views
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from .models import Video, Note, Favorite, Quiz, Question, Choice, QuizAttempt
from .serializers import (
    VideoBasicSerializer, NoteSerializer, 
    FavoriteSerializer, userLoginSerializer, UserRegistrationSerializer,
    QuizSerializer, QuizSubmissionSerializer
)

#  Function Based Views

@api_view(['GET'])
def get_all_videos(request):
    videos = Video.objects.all()
    serializer = VideoBasicSerializer(videos, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_video_detail(request, pk):
    try:
        video = Video.objects.get(pk=pk)
    except Video.DoesNotExist:
        return Response({"detail": "Video not found."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = VideoBasicSerializer(video)
    return Response(serializer.data)

@api_view(['POST'])
def user_logout(request): 
    return Response({'message': "logged out"}, status=200)

# Auth Modules 

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": serializer.data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


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

# Favs View 

class FavoriteListView(APIView): 
    permission_classes = [IsAuthenticated]

    def get(self, request): 
        
        favorites = Favorite.objects.get_user_favorites(request.user)
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request): 
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid(): 
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FavoriteDetailView(generics.RetrieveUpdateDestroyAPIView): 
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        return Favorite.objects.filter(user=self.request.user)

# Note Views

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

class NoteDetailView(APIView): 
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user): 
        try: 
            return Note.objects.get(pk=pk, user=user)
        except Note.DoesNotExist: 
            return None

    def get(self, request, pk): 
        note = self.get_object(pk, request.user)
        if not note: 
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    def put(self, request, pk): 
        note = self.get_object(pk, request.user)
        if not note: 
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk): 
        note = self.get_object(pk, request.user)
        if not note: 
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Quiz Views

class QuizDetailView(generics.RetrieveAPIView):
    """
    Returns the quiz and its questions for a specific video.
    """
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'video_id'

class QuizAttemptView(APIView):
    """
    Handles quiz submissions, calculates score, and updates user profile points.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, video_id):
        try:
            quiz = Quiz.objects.get(video_id=video_id)
        except Quiz.DoesNotExist:
            return Response({"detail": "Quiz not found for this video."}, status=status.HTTP_404_NOT_FOUND)

        # Check if user already attempted this quiz for points
        if QuizAttempt.objects.filter(user=request.user, quiz=quiz).exists():
            return Response({"detail": "You have already completed this quiz."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = QuizSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_answers = serializer.validated_data['answers']
        score = 0
        total_questions = quiz.questions.count()

        for question in quiz.questions.all():
            submitted_choice_id = user_answers.get(str(question.id))
            if submitted_choice_id:
                try:
                    choice = Choice.objects.get(id=submitted_choice_id, question=question)
                    if choice.is_correct:
                        score += 1
                except Choice.DoesNotExist:
                    pass

        # Record the attempt
        QuizAttempt.objects.create(user=request.user, quiz=quiz, score=score)

        # Update user profile points
        profile = request.user.profile
        profile.points += score
        profile.save()

        return Response({
            "score": score,
            "total_questions": total_questions,
            "new_total_points": profile.points
        }, status=status.HTTP_200_OK)
