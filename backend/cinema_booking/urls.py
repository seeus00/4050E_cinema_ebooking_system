from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('movies.urls')),
    path('api/theaters/', include('theaters.urls')),
    path('api/bookings/', include('bookings.urls')),
]
