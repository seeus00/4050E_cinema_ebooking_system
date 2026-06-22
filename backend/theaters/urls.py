from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TheaterHallViewSet, ShowtimeViewSet

router = DefaultRouter()
router.register(r'halls', TheaterHallViewSet, basename='hall')
router.register(r'showtimes', ShowtimeViewSet, basename='showtime')

urlpatterns = [
    path('', include(router.urls)),
]
