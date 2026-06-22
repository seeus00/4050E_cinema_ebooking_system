from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketPriceViewSet, BookingFeeViewSet, SeatLockViewSet

router = DefaultRouter()
router.register(r'ticket-prices', TicketPriceViewSet, basename='ticket-price')
router.register(r'booking-fees', BookingFeeViewSet, basename='booking-fee')
router.register(r'seat-locks', SeatLockViewSet, basename='seat-lock')

urlpatterns = [
    path('', include(router.urls)),
]
