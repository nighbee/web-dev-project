from rest_framework import generics, permissions
from django.db.models import F, Window
from django.db.models.functions import RowNumber
from .models import Profile
from .serializers import ProfileSerializer, LeaderboardSerializer

class ProfileView(generics.RetrieveAPIView):
    """
    Returns the profile details of the authenticated user.
    """
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class LeaderboardView(generics.ListAPIView):
    """
    Returns a global leaderboard of users ordered by points.
    """
    queryset = Profile.objects.annotate(
        rank=Window(expression=RowNumber(), order_by=F('points').desc())
    ).order_by('rank')
    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.AllowAny]  # Leaderboard is usually public
