from django.db import models
from movies.models import Movie

class TheaterHall(models.Model):
    name = models.CharField(max_length=100, unique=True)
    number_of_rows = models.IntegerField(help_text="Number of rows in the hall, e.g. 10")
    seats_per_row = models.IntegerField(help_text="Number of seats per row, e.g. 12")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Seat(models.Model):
    hall = models.ForeignKey(TheaterHall, on_delete=models.CASCADE, related_name='seats')
    row_label = models.CharField(max_length=5, help_text="e.g. A, B, C")
    seat_number = models.IntegerField(help_text="e.g. 1, 2, 3")
    seat_identifier = models.CharField(max_length=10, help_text="e.g. A1, A2")
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('hall', 'seat_identifier')

    def __str__(self):
        return f"{self.hall.name} - {self.seat_identifier}"

class Showtime(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='showtimes')
    hall = models.ForeignKey(TheaterHall, on_delete=models.CASCADE, related_name='showtimes')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.movie.title} in {self.hall.name} at {self.start_time}"
