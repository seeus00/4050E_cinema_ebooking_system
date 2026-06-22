from rest_framework import viewsets, status, permissions, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from .models import TheaterHall, Seat, Showtime
from .serializers import TheaterHallSerializer, SeatSerializer, ShowtimeSerializer

class TheaterHallViewSet(viewsets.ModelViewSet):
    queryset = TheaterHall.objects.filter(is_active=True)
    serializer_class = TheaterHallSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'generate_seats']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    @action(detail=False, methods=['post'], url_path='generate-seats')
    def generate_seats(self, request):
        hall_id = request.data.get('hall_id')
        if not hall_id:
            return Response({"error": "hall_id is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            hall = TheaterHall.objects.get(id=hall_id)
        except TheaterHall.DoesNotExist:
            return Response({"error": "TheaterHall not found."}, status=status.HTTP_404_NOT_FOUND)

        # Generate seats automatically
        num_rows = hall.number_of_rows
        seats_per_row = hall.seats_per_row
        
        created_count = 0
        existing_count = 0
        
        with transaction.atomic():
            for r in range(1, num_rows + 1):
                # Convert 1 -> A, 2 -> B, etc.
                row_label = chr(64 + r) if r <= 26 else f"A{chr(64 + r - 26)}"
                for s in range(1, seats_per_row + 1):
                    seat_identifier = f"{row_label}{s}"
                    seat, created = Seat.objects.get_or_create(
                        hall=hall,
                        row_label=row_label,
                        seat_number=s,
                        seat_identifier=seat_identifier,
                        defaults={'is_active': True}
                    )
                    if created:
                        created_count += 1
                    else:
                        existing_count += 1

        return Response({
            "message": f"Seat generation completed. Created {created_count} seats. {existing_count} seats already existed.",
            "hall_id": hall.id,
            "total_seats": Seat.objects.filter(hall=hall).count()
        }, status=status.HTTP_201_CREATED)

class ShowtimeViewSet(viewsets.ModelViewSet):
    queryset = Showtime.objects.filter(is_active=True).select_related('movie', 'hall').prefetch_related('hall__seats')
    serializer_class = ShowtimeSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        movie_id = self.request.query_params.get('movie_id')
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()
