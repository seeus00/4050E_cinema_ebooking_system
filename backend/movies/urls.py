from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovieViewSet, GenreViewSet, FavoriteMovieView

router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')
router.register(r'genres', GenreViewSet, basename='genre')

urlpatterns = [
    path('favorites/', FavoriteMovieView.as_view(), name='favorite-list'),
    path('favorites/<int:movie_id>/', FavoriteMovieView.as_view(), name='favorite-detail'),
    path('', include(router.urls)),
]
