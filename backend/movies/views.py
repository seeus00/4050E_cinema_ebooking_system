from rest_framework import viewsets, status, permissions, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.dateparse import parse_date
from django.db.models import Q
from .models import Genre, Movie, FavoriteMovie
from .serializers import GenreSerializer, MovieSerializer, FavoriteMovieSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.filter(is_active=True).prefetch_related('genres')
    serializer_class = MovieSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        # Admin restriction for unsafe methods
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    @action(detail=False, methods=['get'], url_path='currently-playing')
    def currently_playing(self, request):
        queryset = self.get_queryset().filter(status='CURRENTLY_PLAYING')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='coming-soon')
    def coming_soon(self, request):
        queryset = self.get_queryset().filter(status='COMING_SOON')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='search')
    def search(self, request):
        title = request.query_params.get('title', '')
        if not title:
            return Response({"error": "Query param 'title' is required."}, status=status.HTTP_400_BAD_REQUEST)
        queryset = self.get_queryset().filter(title__icontains=title)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='filter')
    def filter_by_genre(self, request):
        genre_name = request.query_params.get('genre', '')
        if not genre_name:
            return Response({"error": "Query param 'genre' is required."}, status=status.HTTP_400_BAD_REQUEST)
        if genre_name.isdigit():
            queryset = self.get_queryset().filter(
                Q(genres__name__iexact=genre_name) | Q(genres__id=int(genre_name))
            ).distinct()
        else:
            queryset = self.get_queryset().filter(genres__name__iexact=genre_name).distinct()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='show-date')
    def filter_by_date(self, request):
        date_str = request.query_params.get('date', '')
        if not date_str:
            return Response({"error": "Query param 'date' (YYYY-MM-DD) is required."}, status=status.HTTP_400_BAD_REQUEST)
        parsed_date = parse_date(date_str)
        if not parsed_date:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Filter movies having active showtimes on that day
        queryset = self.get_queryset().filter(
            showtimes__start_time__date=parsed_date,
            showtimes__is_active=True
        ).distinct()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

class FavoriteMovieView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        favorites = FavoriteMovie.objects.filter(user=request.user)
        serializer = FavoriteMovieSerializer(favorites, many=True)
        return Response(serializer.data)

    def post(self, request, movie_id=None, *args, **kwargs):
        if not movie_id:
            movie_id = request.data.get('movie_id')
            
        if not movie_id:
            return Response({"error": "Movie ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            movie = Movie.objects.get(id=movie_id, is_active=True)
        except Movie.DoesNotExist:
            return Response({"error": "Movie not found."}, status=status.HTTP_404_NOT_FOUND)

        fav, created = FavoriteMovie.objects.get_or_create(user=request.user, movie=movie)
        if not created:
            return Response({"error": "Already in favorites."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FavoriteMovieSerializer(fav)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, movie_id, *args, **kwargs):
        try:
            fav = FavoriteMovie.objects.get(user=request.user, movie_id=movie_id)
            fav.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except FavoriteMovie.DoesNotExist:
            return Response({"error": "Favorite not found."}, status=status.HTTP_404_NOT_FOUND)
