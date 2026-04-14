from django.db import models
from django.contrib.auth.models import User 

class Video(models.Model): 
    title = models.CharField(max_length=255)
    youtube_id = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class Quiz(models.Model):
    video = models.OneToOneField(Video, on_delete=models.CASCADE, related_name='quiz')
    title = models.CharField(max_length=255, default="Lecture Quiz")

    def __str__(self):
        return f"Quiz for {self.video.title}"

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()

    def __str__(self):
        return self.text

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'quiz') # One attempt per user per quiz for points

class Note(models.Model): 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    content= models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class FavoriteManager(models.Manager): 
    def get_user_favorites(self, user): 
        return self.filter(user=user)

class Favorite(models.Model): 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    objects = FavoriteManager()
