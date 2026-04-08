from django.db import models
from django.contrib.auth.models import User 

# Create your models here.

class Video(models.Model): 
    title = models.CharField(max_length=255)
    youtube_id = models.CharField(max_length=255)
    
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
