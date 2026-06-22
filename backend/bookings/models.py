from django.db import models
from django.conf import settings
from theaters.models import Seat, Showtime

class TicketPrice(models.Model):
    """Sprint 1: UI only - display ticket prices for different age categories"""
    AGE_CATEGORIES = (
        ('CHILD', 'Child'),
        ('ADULT', 'Adult'),
        ('SENIOR', 'Senior'),
    )

    age_category = models.CharField(max_length=20, choices=AGE_CATEGORIES, unique=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.get_age_category_display()} - ${self.price}"

class BookingFee(models.Model):
    """Sprint 1: UI only - display booking fee information"""
    name = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - ${self.amount}"

class SeatLock(models.Model):
    """Sprint 1: UI only - display seat lock information (for future booking logic)"""
    showtime = models.ForeignKey(Showtime, on_delete=models.CASCADE, related_name='seat_locks')
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE, related_name='seat_locks')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='seat_locks')
    age_category = models.CharField(max_length=20, choices=TicketPrice.AGE_CATEGORIES, default='ADULT')
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('showtime', 'seat')

    def __str__(self):
        return f"Lock for Seat {self.seat.seat_identifier} - Showtime {self.showtime.id}"
