# api/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Trip, Stop, Itinerary, Expense, Flight
from .serializers import TripSerializer, StopSerializer, ItinerarySerializer, ExpenseSerializer, FlightSerializer
import requests

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    @action(detail=True, methods=['get', 'post'])
    def itinerary(self, request, pk=None):
        trip = self.get_object()
        
        if request.method == 'GET':
            itinerary = Itinerary.objects.filter(trip=trip)
            serializer = ItinerarySerializer(itinerary, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = ItinerarySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(trip=trip)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)

    @action(detail=True, methods=['get', 'post'])
    def expenses(self, request, pk=None):
        trip = self.get_object()
        
        if request.method == 'GET':
            expenses = Expense.objects.filter(trip=trip)
            serializer = ExpenseSerializer(expenses, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            serializer = ExpenseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(trip=trip)
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
    
    @action(detail=True, methods=['get', 'post'])
    def flights(self, request, pk=None):
        trip = self.get_object()
        
        if request.method == 'GET':
            flights = Flight.objects.filter(trip=trip)
            serializer = FlightSerializer(flights, many=True)
            return Response(serializer.data)
        
        elif request.method == 'POST':
            flight_number = request.data.get('flight_number')
            flight_date = request.data.get('flight_date')
            
            # Check if flight data already exists in cache (database)
            existing_flight = Flight.objects.filter(
                flight_number=flight_number,
                flight_date=flight_date
            ).first()
            
            if existing_flight and existing_flight.flight_data:
                # Use cached data, just create new instance for this trip
                flight = Flight.objects.create(
                    trip=trip,
                    flight_number=flight_number,
                    flight_date=flight_date,
                    flight_data=existing_flight.flight_data
                )
                serializer = FlightSerializer(flight)
                return Response(serializer.data, status=201)
            
            # Call AviationStack API only if not cached
            api_key = '07bae69d8481c9ded885382fc2e5c6e8'
            url = f'http://api.aviationstack.com/v1/flights'
            params = {
                'access_key': api_key,
                'flight_iata': flight_number
            }
            
            try:
                response = requests.get(url, params=params)
                api_data = response.json()
                
                # Create flight with API data
                flight = Flight.objects.create(
                    trip=trip,
                    flight_number=flight_number,
                    flight_date=flight_date,
                    flight_data=api_data.get('data', [{}])[0] if api_data.get('data') else {}
                )
                
                serializer = FlightSerializer(flight)
                return Response(serializer.data, status=201)
            except Exception as e:
                return Response({'error': str(e)}, status=400)

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer

class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

class FlightViewSet(viewsets.ModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer