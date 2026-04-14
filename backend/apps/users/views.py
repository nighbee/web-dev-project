from rest_framework import generics, permissions
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
    queryset = Profile.objects.all().order_by('-points')
    serializer_class = LeaderboardSerializer
    permission_classes = [permissions.AllowAny] # Leaderboard is usually public
