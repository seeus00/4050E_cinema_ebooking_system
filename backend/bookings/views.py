from rest_framework import viewsets, permissions
from .models import TicketPrice, BookingFee, SeatLock
from .serializers import TicketPriceSerializer, BookingFeeSerializer, SeatLockSerializer

class TicketPriceViewSet(viewsets.ModelViewSet):
    """Sprint 1: UI only - Display ticket prices"""
    queryset = TicketPrice.objects.filter(is_active=True)
    serializer_class = TicketPriceSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

class BookingFeeViewSet(viewsets.ModelViewSet):
    """Sprint 1: UI only - Display booking fees"""
    queryset = BookingFee.objects.filter(is_active=True)
    serializer_class = BookingFeeSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

class SeatLockViewSet(viewsets.ModelViewSet):
    """Sprint 1: UI only - Display seat lock information (for future booking logic)"""
    queryset = SeatLock.objects.filter(is_active=True)
    serializer_class = SeatLockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated]
        return super().get_permissions()
