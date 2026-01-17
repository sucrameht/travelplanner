# api/serializers.py
from rest_framework import serializers
from .models import Trip, Stop

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    # This ensures that when you get a Trip, you also get its Stops inside it
    stops = StopSerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'