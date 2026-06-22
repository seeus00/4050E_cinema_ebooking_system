from django.db import models
from django.conf import settings

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Movie(models.Model):
    STATUS_CHOICES = (
        ('CURRENTLY_PLAYING', 'Currently Playing'),
        ('COMING_SOON', 'Coming Soon'),
    )

    title = models.CharField(max_length=255)
    genres = models.ManyToManyField(Genre, related_name='movies')
    cast = models.TextField(help_text="Comma-separated cast members")
    director = models.CharField(max_length=255)
    producer = models.CharField(max_length=255)
    synopsis = models.TextField()
    reviews = models.TextField(blank=True, null=True, help_text="Mock user reviews or reviews summary")
    trailer_image = models.CharField(max_length=500, help_text="URL of the trailer thumbnail image")
    trailer_video_url = models.URLField(help_text="URL of the trailer video")
    mpaa_rating = models.CharField(max_length=10, help_text="e.g. PG, PG-13, R")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='CURRENTLY_PLAYING')
    release_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class FavoriteMovie(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')

    def __str__(self):
        return f"{self.user.email} - {self.movie.title}"
