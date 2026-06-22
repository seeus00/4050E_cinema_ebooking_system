from rest_framework import serializers
from .models import TheaterHall, Seat, Showtime
from movies.serializers import MovieSerializer

class TheaterHallSerializer(serializers.ModelSerializer):
    class Meta:
        model = TheaterHall
        fields = ['id', 'name', 'number_of_rows', 'seats_per_row', 'is_active']
        read_only_fields = ['id']

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ['id', 'hall', 'row_label', 'seat_number', 'seat_identifier', 'is_active']
        read_only_fields = ['id']

class ShowtimeSerializer(serializers.ModelSerializer):
    movie_detail = MovieSerializer(source='movie', read_only=True)
    hall_detail = TheaterHallSerializer(source='hall', read_only=True)
    seats = SeatSerializer(source='hall.seats', many=True, read_only=True)

    class Meta:
        model = Showtime
        fields = ['id', 'movie', 'movie_detail', 'hall', 'hall_detail', 'seats', 'start_time', 'end_time', 'is_active']
        read_only_fields = ['id']
