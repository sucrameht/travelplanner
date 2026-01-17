# api/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import Trip, Stop, Itinerary, Expense, Flight
from .serializers import TripSerializer, StopSerializer, ItinerarySerializer, ExpenseSerializer, FlightSerializer
import requests
import json
import os

# You can use OpenAI, Anthropic, or any other LLM
# For this example, I'll show a structure that works with OpenAI
def generate_events_with_llm(destination):
    """
    Generate suggested events for a destination using Claude AI.
    
    Supports:
    1. Anthropic Claude (PRIMARY) - set ANTHROPIC_API_KEY
    2. Ollama (local fallback) - free
    3. Smart fallback
    """
    
    # PRIMARY: Anthropic Claude
    if os.environ.get('ANTHROPIC_API_KEY'):
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))
            
            message = client.messages.create(
                model="claude-sonnet-4-5",
                max_tokens=1500,
                messages=[
                    {"role": "user", "content": f"Suggest 5 tourist activities in {destination}. For each activity, provide a real Unsplash image URL that represents it. Return ONLY a valid JSON array (no markdown): [{{'name':'Activity Name','category':'Food|Attraction|Museum|Activity|Tour|Entertainment|Cultural|Shopping|Dining','duration':2.0,'estimatedCost':30,'description':'Description','imageUrl':'https://images.unsplash.com/photo-...'}}]. Use appropriate Unsplash URLs for real photos."}
                ]
            )
            
            content = message.content[0].text.strip()
            if content.startswith('```'):
                content = content.split('```')[1]
                if content.startswith('json'):
                    content = content[4:]
            content = content.strip()
            
            events = json.loads(content)
            print(f"✅ Generated events with Claude for {destination}")
            return events
        except Exception as e:
            print(f"Claude error: {e}")
    
    # Try Ollama (local LLM)
    # try:
    #     import requests
    #     response = requests.post('http://localhost:11434/api/generate', 
    #         json={
    #             "model": "llama3.2",
    #             "prompt": f"Suggest 5 tourist activities in {destination}. Return ONLY a JSON array: [{{'name':'','category':'','duration':0,'estimatedCost':0,'description':''}}]",
    #             "stream": False,
    #             "format": "json"
    #         },
    #         timeout=10
    #     )
    #     if response.status_code == 200:
    #         events = json.loads(response.json()['response'])
    #         print(f"✅ Generated events with Ollama for {destination}")
    #         return events
    # except Exception as e:
    #     print(f"Ollama not available: {e}")
    
    # Fallback to smart suggestions
    print(f"ℹ️  Using smart fallback for {destination}")
    return generate_smart_fallback(destination)

def generate_smart_fallback(destination):
    """Generate contextual suggestions based on destination keywords"""
    dest_lower = destination.lower()
    
    # Beach destinations
    if any(word in dest_lower for word in ['beach', 'island', 'hawaii', 'maldives', 'bali', 'caribbean']):
        return [
            {'id': 'beach-1', 'name': 'Beach Day & Water Sports', 'category': 'Activity', 'duration': 4, 'estimatedCost': 50, 'description': 'Relax on the beach and try water activities', 'imageUrl': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'},
            {'id': 'beach-2', 'name': 'Snorkeling Tour', 'category': 'Tour', 'duration': 3, 'estimatedCost': 75, 'description': 'Explore underwater marine life', 'imageUrl': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'},
            {'id': 'beach-3', 'name': 'Sunset Cruise', 'category': 'Activity', 'duration': 2, 'estimatedCost': 60, 'description': 'Scenic boat ride at sunset', 'imageUrl': 'https://images.unsplash.com/photo-1544551763-92778ce91e9b?w=400'},
            {'id': 'beach-4', 'name': 'Beachfront Restaurant', 'category': 'Dining', 'duration': 2, 'estimatedCost': 80, 'description': 'Fresh seafood with ocean views', 'imageUrl': 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400'},
            {'id': 'beach-5', 'name': 'Spa & Wellness', 'category': 'Relaxation', 'duration': 2.5, 'estimatedCost': 100, 'description': 'Rejuvenating spa treatments', 'imageUrl': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400'},
        ]
    
    # Mountain/Nature destinations
    elif any(word in dest_lower for word in ['mountain', 'alps', 'hiking', 'nature', 'park', 'forest']):
        return [
            {'id': 'mountain-1', 'name': 'Scenic Hiking Trail', 'category': 'Activity', 'duration': 4, 'estimatedCost': 10, 'description': 'Explore beautiful mountain trails', 'imageUrl': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400'},
            {'id': 'mountain-2', 'name': 'Cable Car Ride', 'category': 'Attraction', 'duration': 1.5, 'estimatedCost': 40, 'description': 'Panoramic views from cable car', 'imageUrl': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'},
            {'id': 'mountain-3', 'name': 'Mountain Biking', 'category': 'Activity', 'duration': 3, 'estimatedCost': 50, 'description': 'Bike through scenic mountain paths', 'imageUrl': 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=400'},
            {'id': 'mountain-4', 'name': 'Local Mountain Lodge Lunch', 'category': 'Dining', 'duration': 1.5, 'estimatedCost': 35, 'description': 'Traditional mountain cuisine', 'imageUrl': 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400'},
            {'id': 'mountain-5', 'name': 'Wildlife Watching', 'category': 'Activity', 'duration': 2.5, 'estimatedCost': 30, 'description': 'Spot local wildlife in natural habitat', 'imageUrl': 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400'},
        ]
    
    # City destinations
    else:
        return [
            {'id': 'city-1', 'name': f'{destination} City Walking Tour', 'category': 'Tour', 'duration': 3, 'estimatedCost': 25, 'description': 'Explore major landmarks and history', 'imageUrl': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'},
            {'id': 'city-2', 'name': 'Local Museum Visit', 'category': 'Museum', 'duration': 2.5, 'estimatedCost': 20, 'description': 'Discover local art and culture', 'imageUrl': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400'},
            {'id': 'city-3', 'name': 'Food Market Tour', 'category': 'Food', 'duration': 2, 'estimatedCost': 40, 'description': 'Taste local specialties and street food', 'imageUrl': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'},
            {'id': 'city-4', 'name': 'Shopping District', 'category': 'Shopping', 'duration': 2, 'estimatedCost': 60, 'description': 'Browse local shops and boutiques', 'imageUrl': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'},
            {'id': 'city-5', 'name': 'Evening City Views', 'category': 'Attraction', 'duration': 1.5, 'estimatedCost': 15, 'description': 'Best viewpoints for city skyline', 'imageUrl': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400'},
        ]

@api_view(['POST'])
def generate_events_view(request):
    """API endpoint to generate suggested events for a destination"""
    from .models import SuggestedEvent
    
    destination = request.data.get('destination', '')
    force_regenerate = request.data.get('regenerate', False)  # Allow forcing new generation
    
    if not destination:
        return Response({'error': 'Destination is required'}, status=400)
    
    # Normalize destination for consistent caching
    destination_key = destination.strip().lower()
    
    # Check if we have cached suggestions (unless force regenerate)
    if not force_regenerate:
        try:
            cached = SuggestedEvent.objects.get(destination__iexact=destination_key)
            print(f"✨ Using cached events for {destination}")
            return Response({
                'events': cached.events_data, 
                'destination': destination,
                'cached': True,
                'generated_at': cached.updated_at
            })
        except SuggestedEvent.DoesNotExist:
            pass
    
    # Generate new events
    events = generate_events_with_llm(destination)
    
    # Cache the results
    try:
        SuggestedEvent.objects.update_or_create(
            destination__iexact=destination_key,
            defaults={
                'destination': destination,
                'events_data': events
            }
        )
        print(f"💾 Cached events for {destination}")
    except Exception as e:
        print(f"Warning: Failed to cache events: {e}")
    
    return Response({
        'events': events, 
        'destination': destination,
        'cached': False
    })

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