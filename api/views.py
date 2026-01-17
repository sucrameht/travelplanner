# api/views.py
from rest_framework import viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from .models import Trip, Stop, Itinerary, Expense
from .serializers import TripSerializer, StopSerializer, ItinerarySerializer, ExpenseSerializer
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
            {'name': 'Beach Day & Water Sports', 'category': 'Activity', 'duration': 4, 'estimatedCost': 50, 'description': 'Relax on the beach and try water activities'},
            {'name': 'Snorkeling Tour', 'category': 'Tour', 'duration': 3, 'estimatedCost': 75, 'description': 'Explore underwater marine life'},
            {'name': 'Sunset Cruise', 'category': 'Activity', 'duration': 2, 'estimatedCost': 60, 'description': 'Scenic boat ride at sunset'},
            {'name': 'Beachfront Restaurant', 'category': 'Dining', 'duration': 2, 'estimatedCost': 80, 'description': 'Fresh seafood with ocean views'},
            {'name': 'Spa & Wellness', 'category': 'Relaxation', 'duration': 2.5, 'estimatedCost': 100, 'description': 'Rejuvenating spa treatments'},
        ]
    
    # Mountain/Nature destinations
    elif any(word in dest_lower for word in ['mountain', 'alps', 'hiking', 'nature', 'park', 'forest']):
        return [
            {'name': 'Scenic Hiking Trail', 'category': 'Activity', 'duration': 4, 'estimatedCost': 10, 'description': 'Explore beautiful mountain trails'},
            {'name': 'Cable Car Ride', 'category': 'Attraction', 'duration': 1.5, 'estimatedCost': 40, 'description': 'Panoramic views from cable car'},
            {'name': 'Mountain Biking', 'category': 'Activity', 'duration': 3, 'estimatedCost': 50, 'description': 'Bike through scenic mountain paths'},
            {'name': 'Local Mountain Lodge Lunch', 'category': 'Dining', 'duration': 1.5, 'estimatedCost': 35, 'description': 'Traditional mountain cuisine'},
            {'name': 'Wildlife Watching', 'category': 'Activity', 'duration': 2.5, 'estimatedCost': 30, 'description': 'Spot local wildlife in natural habitat'},
        ]
    
    # City destinations
    else:
        return [
            {'name': f'{destination} City Walking Tour', 'category': 'Tour', 'duration': 3, 'estimatedCost': 25, 'description': 'Explore major landmarks and history'},
            {'name': 'Local Museum Visit', 'category': 'Museum', 'duration': 2.5, 'estimatedCost': 20, 'description': 'Discover local art and culture'},
            {'name': 'Food Market Tour', 'category': 'Food', 'duration': 2, 'estimatedCost': 40, 'description': 'Taste local specialties and street food'},
            {'name': 'Shopping District', 'category': 'Shopping', 'duration': 2, 'estimatedCost': 60, 'description': 'Browse local shops and boutiques'},
            {'name': 'Evening City Views', 'category': 'Attraction', 'duration': 1.5, 'estimatedCost': 15, 'description': 'Best viewpoints for city skyline'},
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

class StopViewSet(viewsets.ModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer

class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer