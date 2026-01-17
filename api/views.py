# api/views.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Trip, Stop, Itinerary, Expense
from .serializers import TripSerializer, StopSerializer, ItinerarySerializer, ExpenseSerializer

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

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer

class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer