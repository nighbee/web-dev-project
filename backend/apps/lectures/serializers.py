from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Video, Note, Favorite


class NoteSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Note 
        fields = ['id', 'user' , 'video', 'content', 'created_at']
        read_only_fields = ['user']



class FavoriteSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Favorite
        fields = ['id', 'user', 'video']
        read_only_fields = ['user']

class VideoBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'youtube_id']



class userLoginSerializer(serializers.Serializer): 
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username or not password: 
            raise serializers.ValidationError("Username and password are required")

        user = User.objects.filter(username=username).first()
        if not user or not user.check_password(password): 
            raise serializers.ValidationError("Invalid username or password")

        return attrs