from rest_framework import serializers
from .models import TicketPrice, BookingFee, SeatLock

class TicketPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketPrice
        fields = ['id', 'age_category', 'price', 'is_active']
        read_only_fields = ['id']

class BookingFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingFee
        fields = ['id', 'name', 'amount', 'is_active']
        read_only_fields = ['id']

class SeatLockSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeatLock
        fields = ['id', 'showtime', 'seat', 'user', 'age_category', 'expires_at', 'created_at', 'is_active']
        read_only_fields = ['id', 'created_at']
