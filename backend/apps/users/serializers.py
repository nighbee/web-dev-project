from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import F, Window
from django.db.models.functions import RowNumber
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ['user', 'points']

class LeaderboardSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    rank = serializers.IntegerField(read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'points', 'rank']
