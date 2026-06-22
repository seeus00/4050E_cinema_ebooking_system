from django.contrib import admin
from .models import TicketPrice, BookingFee, SeatLock

admin.site.register(TicketPrice)
admin.site.register(BookingFee)
admin.site.register(SeatLock)
