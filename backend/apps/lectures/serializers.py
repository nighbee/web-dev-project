from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Video, Note, Favorite, Quiz, Question, Choice, QuizAttempt

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


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

class VideoBasicSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=255)
    youtube_id = serializers.CharField(max_length=255)



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

# Quiz Serializers

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text']

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'choices']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'questions']

class QuizSubmissionSerializer(serializers.Serializer):
    # Format: { "question_id": choice_id }
    answers = serializers.DictField(
        child=serializers.IntegerField()
    )