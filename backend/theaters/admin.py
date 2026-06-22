from django.contrib import admin
from .models import TheaterHall, Seat, Showtime

admin.site.register(TheaterHall)
admin.site.register(Seat)
admin.site.register(Showtime)
