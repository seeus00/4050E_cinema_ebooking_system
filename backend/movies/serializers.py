from rest_framework import serializers
from .models import Genre, Movie, FavoriteMovie

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)
    genre_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=Genre.objects.all(), source='genres', required=False
    )

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'genres', 'genre_ids', 'cast', 'director', 'producer',
            'synopsis', 'reviews', 'trailer_image', 'trailer_video_url',
            'mpaa_rating', 'status', 'release_date', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        genres = validated_data.pop('genres', [])
        movie = Movie.objects.create(**validated_data)
        movie.genres.set(genres)
        return movie

    def update(self, instance, validated_data):
        genres = validated_data.pop('genres', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if genres is not None:
            instance.genres.set(genres)
        return instance

class FavoriteMovieSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    movie_id = serializers.PrimaryKeyRelatedField(
        write_only=True, queryset=Movie.objects.all(), source='movie'
    )

    class Meta:
        model = FavoriteMovie
        fields = ['id', 'movie', 'movie_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        user = self.context['request'].user
        movie = attrs['movie']
        if FavoriteMovie.objects.filter(user=user, movie=movie).exists():
            raise serializers.ValidationError("This movie is already in your favorites.")
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
