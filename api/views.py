# api/views.py
from rest_framework import viewsets
from .models import Trip, Stop
from .serializers import TripSerializer, StopSerializer

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer