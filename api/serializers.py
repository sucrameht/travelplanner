# api/serializers.py
from rest_framework import serializers
from .models import Trip, Stop, Itinerary, Expense, Flight, TravelMethod

class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'

class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = '__all__'

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = '__all__'

class TravelMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelMethod
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    # This ensures that when you get a Trip, you also get its Stops inside it
    stops = StopSerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = '__all__'